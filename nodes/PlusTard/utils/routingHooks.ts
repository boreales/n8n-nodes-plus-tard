import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

/**
 * Utility functions for routing hooks that process and transform data
 */

/**
 * Builds the pages array from selected platforms and pages
 */
function buildPagesArray(executeFunctions: IExecuteSingleFunctions): string[] {
	const selectedPlatforms = executeFunctions.getNodeParameter(
		'selectedPlatforms',
		[],
	) as string[];

	const allPages: string[] = [];

	selectedPlatforms.forEach((platform: string) => {
		const pagesParam = `${platform}Pages`;
		const pages = executeFunctions.getNodeParameter(pagesParam, []) as string[];
		if (pages && Array.isArray(pages)) {
			allPages.push(...pages);
		}
	});

	return allPages;
}

/**
 * Processes media items from fixedCollection to array of URLs
 */
function processMediaItems(executeFunctions: IExecuteSingleFunctions): string[] {
	const imagePostsData = executeFunctions.getNodeParameter(
		'imagePosts',
		{ items: [] },
	) as { items: Array<{ url: string }> };

	if (!imagePostsData || !imagePostsData.items || !Array.isArray(imagePostsData.items)) {
		return [];
	}

	return imagePostsData.items.map((item) => item.url).filter((url) => url);
}

/**
 * Builds Twitter-specific parameters object
 */
function buildTwitterParams(
	executeFunctions: IExecuteSingleFunctions,
): { is_thread: boolean; max_chars_per_tweet: number } | undefined {
	const selectedPlatforms = executeFunctions.getNodeParameter(
		'selectedPlatforms',
		[],
	) as string[];

	if (!selectedPlatforms.includes('twitter')) {
		return undefined;
	}

	const isThread = executeFunctions.getNodeParameter('twitterIsThread', false) as boolean;
	const maxCharsPerTweet = executeFunctions.getNodeParameter('twitterMaxCharsPerTweet', 280) as number;

	return {
		is_thread: isThread,
		max_chars_per_tweet: maxCharsPerTweet,
	};
}

/**
 * Builds TikTok-specific parameters object
 */
function buildTiktokParams(
	executeFunctions: IExecuteSingleFunctions,
): {
	privacy_level: string;
	disable_comment: boolean;
	disable_duet: boolean;
	disable_stitch: boolean;
	brand_organic_toggle: boolean;
	brand_content_toggle: boolean;
} | undefined {
	const selectedPlatforms = executeFunctions.getNodeParameter(
		'selectedPlatforms',
		[],
	) as string[];

	if (!selectedPlatforms.includes('tiktok')) {
		return undefined;
	}

	return {
		privacy_level: executeFunctions.getNodeParameter('tiktokPrivacyLevel', 'PUBLIC_TO_EVERYONE') as string,
		disable_comment: executeFunctions.getNodeParameter('tiktokDisableComment', false) as boolean,
		disable_duet: executeFunctions.getNodeParameter('tiktokDisableDuet', false) as boolean,
		disable_stitch: executeFunctions.getNodeParameter('tiktokDisableStitch', false) as boolean,
		brand_organic_toggle: executeFunctions.getNodeParameter('tiktokBrandOrganicToggle', false) as boolean,
		brand_content_toggle: executeFunctions.getNodeParameter('tiktokBrandContentToggle', false) as boolean,
	};
}

/**
 * Pre-send hook for posts create operation
 */
export async function postsCreatePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	// Get all selected pages from all platforms
	const pageIds = buildPagesArray(this);

	// Get the first page ID
	const pageId = pageIds[0] || this.getNodeParameter('pageId', '');

	// Get provider (first selected platform)
	const selectedPlatforms = this.getNodeParameter('selectedPlatforms', []) as string[];
	const provider = selectedPlatforms[0] || this.getNodeParameter('provider', '');

	// Process media items
	const imagePosts = processMediaItems(this);

	// Build platform-specific parameters
	const twitterParams = buildTwitterParams(this);
	const tiktokParams = buildTiktokParams(this);

	// Build the request body with required fields
	const body: Record<string, unknown> = {
		provider: provider,
		plannedAt: this.getNodeParameter('plannedAt'),
		pageId: pageId,
	};

	// Add optional text field if provided
	const text = this.getNodeParameter('text', '') as string;
	if (text) {
		body.text = text;
	}

	// Add optional imagePosts if any media is provided
	if (imagePosts.length > 0) {
		body.imagePosts = imagePosts;
	}

	// Add platform-specific parameters only if the platform is selected
	if (twitterParams) {
		body.twitterParams = twitterParams;
	}

	if (tiktokParams) {
		body.tiktokParams = tiktokParams;
	}

	requestOptions.body = body;

	return requestOptions;
}

/**
 * Pre-send hook for media upload operation.
 * Reads binary data from the input item and constructs a multipart/form-data request.
 */
export async function mediaUploadPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const binaryPropertyName = this.getNodeParameter('binaryProperty', 'data') as string;
	const fileName = this.getNodeParameter('fileName', '') as string;

	const binaryData = this.helpers.assertBinaryData(binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

	const resolvedFileName = fileName || binaryData.fileName || 'file';
	const mimeType = binaryData.mimeType || 'application/octet-stream';

	const formData = new FormData();
	const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
	formData.append('file', blob, resolvedFileName);

	requestOptions.body = formData;
	requestOptions.headers = {
		...requestOptions.headers,
	};
	// Remove Content-Type so the runtime sets the correct multipart boundary
	delete requestOptions.headers['Content-Type'];

	return requestOptions;
}
