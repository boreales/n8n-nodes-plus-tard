import type { IExecuteFunctions } from 'n8n-workflow';

/**
 * Utility functions for routing hooks that process and transform data
 */

/**
 * Builds the pages array from selected platforms and pages
 */
function buildPagesArray(executeFunctions: IExecuteFunctions, itemIndex: number): string[] {
	const selectedPlatforms = executeFunctions.getNodeParameter(
		'selectedPlatforms',
		itemIndex,
		[],
	) as string[];

	const allPages: string[] = [];

	selectedPlatforms.forEach((platform: string) => {
		const pagesParam = `${platform}Pages`;
		const pages = executeFunctions.getNodeParameter(pagesParam, itemIndex, []) as string[];
		allPages.push(...pages);
	});

	return allPages;
}

/**
 * Processes media items from fixedCollection to array of URLs
 */
function processMediaItems(executeFunctions: IExecuteFunctions, itemIndex: number): string[] {
	const imagePostsData = executeFunctions.getNodeParameter(
		'imagePosts',
		itemIndex,
		{ items: [] },
	) as { items: Array<{ url: string }> };

	return imagePostsData.items.map((item) => item.url).filter((url) => url);
}

/**
 * Processes platform-specific parameters
 */
function processPlatformParams(
	executeFunctions: IExecuteFunctions,
	itemIndex: number,
	paramName: string,
): string[] {
	const paramsData = executeFunctions.getNodeParameter(paramName, itemIndex, {
		items: [],
	}) as { items: Array<{ param: string }> };

	return paramsData.items.map((item) => item.param).filter((param) => param);
}

/**
 * Pre-send hook for posts create operation
 */
export async function postsCreatePreSend(
	this: IExecuteFunctions,
	requestOptions: { body?: Record<string, unknown> },
): Promise<{ body?: Record<string, unknown> }> {
	const itemIndex = 0;

	// Get all selected pages from all platforms
	const pageIds = buildPagesArray(this, itemIndex);

	// Get the first page ID (or use provider-based logic if needed)
	const pageId = pageIds[0] || this.getNodeParameter('pageId', itemIndex, '');

	// Get provider (first selected platform)
	const selectedPlatforms = this.getNodeParameter('selectedPlatforms', itemIndex, []) as string[];
	const provider = selectedPlatforms[0] || this.getNodeParameter('provider', itemIndex, '');

	// Process media items
	const imagePosts = processMediaItems(this, itemIndex);

	// Process platform-specific parameters
	const twitterParams = processPlatformParams(this, itemIndex, 'twitterParams');
	const tiktokParams = processPlatformParams(this, itemIndex, 'tiktokParams');

	// Build the request body
	requestOptions.body = {
		text: this.getNodeParameter('text', itemIndex),
		provider: provider,
		plannedAt: this.getNodeParameter('plannedAt', itemIndex),
		pageId: pageId,
		imagePosts: imagePosts,
		twitterParams: twitterParams,
		tiktokParams: tiktokParams,
	};

	return requestOptions;
}
