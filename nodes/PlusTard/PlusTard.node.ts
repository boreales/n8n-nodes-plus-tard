import type {
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { buildNodeProperties } from './utils/nodeBuilder';
import { loadPlatformAccounts, SUPPORTED_PLATFORMS } from './utils/platformHelpers';
import { postsResource, mediaResource } from './resources';

export class PlusTard implements INodeType {
	methods = {
		loadOptions: Object.fromEntries(
			SUPPORTED_PLATFORMS.map((platform) => [
				`get${platform.value.charAt(0).toUpperCase() + platform.value.slice(1)}Pages`,
				async function (this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
					return loadPlatformAccounts.call(this, platform.value);
				},
			]),
		),
	};

	description: INodeTypeDescription = {
		displayName: 'Plus Tard',
		name: 'plusTard',
		icon: 'file:plustard.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description:
			'Schedule and manage social media posts across multiple platforms with Plus Tard - supporting Twitter/X, Facebook, Instagram, LinkedIn, TikTok, Bluesky, and Threads',
		defaults: {
			name: 'Plus Tard',
		},
		inputs: ['main'],
		outputs: ['main'],

		credentials: [
			{
				name: 'plusTardAPIApi',
				required: true,
			},
		],

		requestDefaults: {
			baseURL: 'https://plus-tard.com/api',
			headers: {
				Accept: 'application/ld+json',
				'Content-Type': 'application/ld+json',
			},
		},

		properties: buildNodeProperties({
			posts: postsResource,
			media: mediaResource,
		}),
		usableAsTool: true,
	};
}
