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
		executeFunctions.logger.debug(`[PlusTard] Platform: ${platform}, Param: ${pagesParam}, Pages: ${JSON.stringify(pages)}`);
		if (pages && Array.isArray(pages)) {
			allPages.push(...pages);
		}
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

	if (!imagePostsData || !imagePostsData.items || !Array.isArray(imagePostsData.items)) {
		return [];
	}

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

	if (!paramsData || !paramsData.items || !Array.isArray(paramsData.items)) {
		return [];
	}

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

	this.logger.debug('[PlusTard] Starting postsCreatePreSend');

	// Get all selected pages from all platforms
	const pageIds = buildPagesArray(this, itemIndex);
	this.logger.debug(`[PlusTard] pageIds: ${JSON.stringify(pageIds)}`);

	// Get the first page ID (or use provider-based logic if needed)
	const pageId = pageIds[0] || this.getNodeParameter('pageId', itemIndex, '');
	this.logger.debug(`[PlusTard] pageId: ${pageId}`);

	// Get provider (first selected platform)
	const selectedPlatforms = this.getNodeParameter('selectedPlatforms', itemIndex, []) as string[];
	const provider = selectedPlatforms[0] || this.getNodeParameter('provider', itemIndex, '');
	this.logger.debug(`[PlusTard] provider: ${provider}`);

	// Process media items
	const imagePosts = processMediaItems(this, itemIndex);
	this.logger.debug(`[PlusTard] imagePosts: ${JSON.stringify(imagePosts)}`);

	// Process platform-specific parameters
	const twitterParams = processPlatformParams(this, itemIndex, 'twitterParams');
	this.logger.debug(`[PlusTard] twitterParams: ${JSON.stringify(twitterParams)}`);

	const tiktokParams = processPlatformParams(this, itemIndex, 'tiktokParams');
	this.logger.debug(`[PlusTard] tiktokParams: ${JSON.stringify(tiktokParams)}`);

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
