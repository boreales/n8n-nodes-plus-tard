import type { INodeProperties } from 'n8n-workflow';
import { SUPPORTED_PLATFORMS } from './platformHelpers';

/**
 * Builds platform selection field
 */
export function buildPlatformSelector(): INodeProperties {
	return {
		displayName: 'Platforms',
		name: 'selectedPlatforms',
		type: 'multiOptions',
		options: SUPPORTED_PLATFORMS.map((platform) => ({
			name: platform.name,
			value: platform.value,
		})),
		default: [],
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
			},
		},
		description:
			'Select the platforms where you want to post your content. After selecting platforms, you will be able to choose specific pages/accounts for each platform.',
		required: true,
	};
}

/**
 * Builds account/page selector fields for all platforms
 */
export function buildPageSelectors(): INodeProperties[] {
	return SUPPORTED_PLATFORMS.map((platform) => ({
		displayName: platform.displayName,
		name: `${platform.value}Pages`,
		type: 'multiOptions' as const,
		typeOptions: {
			loadOptionsMethod: `get${platform.value.charAt(0).toUpperCase() + platform.value.slice(1)}Pages`,
		},
		default: [],
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
				selectedPlatforms: [platform.value],
			},
		},
		description: `Select the ${platform.name} pages/accounts to post to. Make sure you have connected ${platform.name} pages in Plus Tard.`,
	}));
}

/**
 * Builds media items field
 */
export function buildMediaItemsField(): INodeProperties {
	return {
		displayName: 'Image URLs',
		name: 'imagePosts',
		type: 'fixedCollection',
		default: { items: [] },
		typeOptions: {
			multipleValues: true,
			sortable: true,
		},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
			},
		},
		description:
			'Media files to attach to your post. Upload files first using the Media resource, then use the returned URLs here.',
		options: [
			{
				name: 'items',
				displayName: 'Media Items',
				values: [
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						noDataExpression: false,
						description: 'URL of the uploaded media file. You can use expressions like ={{ $JSON.URL }}.',
						placeholder: 'https://example.com/image.jpg',
						required: true,
					},
				],
			},
		],
	};
}

/**
 * Builds common post fields
 */
export function buildCommonPostFields(): INodeProperties[] {
	return [
		{
			displayName: 'Text Content',
			name: 'text',
			type: 'string',
			typeOptions: {
				rows: 4,
			},
			default: '',
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
				},
			},
			description:
				'The main text content of your post. Will be used across all selected platforms. Note: Different platforms have different character limits.',
			placeholder: 'Hello, world! #socialmedia #automation',
			required: true,
		},
		{
			displayName: 'Scheduled For',
			name: 'plannedAt',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
				},
			},
			description:
				'When to publish the post (ISO 8601 format). Leave empty to publish immediately.',
			required: true,
		},
	];
}

/**
 * Builds platform-specific parameter fields
 */
export function buildPlatformSpecificFields(): INodeProperties[] {
	return [
		// Twitter Parameters
		{
			displayName: 'Enable Thread Mode',
			name: 'twitterIsThread',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['twitter'],
				},
			},
			description: 'When enabled, the text will be automatically split into multiple tweets',
		},
		{
			displayName: 'Max Characters Per Tweet',
			name: 'twitterMaxCharsPerTweet',
			type: 'number',
			default: 280,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['twitter'],
					twitterIsThread: [true],
				},
			},
			description: 'Maximum number of characters per tweet in a thread',
		},
		// TikTok Parameters
		{
			displayName: 'Privacy Level',
			name: 'tiktokPrivacyLevel',
			type: 'options',
			options: [
				{
					name: 'Public To Everyone',
					value: 'PUBLIC_TO_EVERYONE',
				},
				{
					name: 'Mutual Follow Friends',
					value: 'MUTUAL_FOLLOW_FRIENDS',
				},
				{
					name: 'Follower Of Creator',
					value: 'FOLLOWER_OF_CREATOR',
				},
				{
					name: 'Self Only',
					value: 'SELF_ONLY',
				},
			],
			default: 'PUBLIC_TO_EVERYONE',
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Privacy level for the TikTok post',
		},
		{
			displayName: 'Disable Comments',
			name: 'tiktokDisableComment',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Whether to disable comments on this post',
		},
		{
			displayName: 'Disable Duet',
			name: 'tiktokDisableDuet',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Whether to disable duets for this post',
		},
		{
			displayName: 'Disable Stitch',
			name: 'tiktokDisableStitch',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Whether to disable stitch for this post',
		},
		{
			displayName: 'Brand Organic Content',
			name: 'tiktokBrandOrganicToggle',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Whether this is organic promotional content',
		},
		{
			displayName: 'Brand Partnership Content',
			name: 'tiktokBrandContentToggle',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					resource: ['posts'],
					operation: ['create'],
					selectedPlatforms: ['tiktok'],
				},
			},
			description: 'Whether this is a brand partnership post',
		},
	];
}
