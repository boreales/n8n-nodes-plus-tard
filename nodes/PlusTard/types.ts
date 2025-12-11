import type { INodeProperties } from 'n8n-workflow';

export interface PlusTardResourceConfig {
	name: string;
	value: string;
	description: string;
}

export interface PlusTardOperationConfig {
	name: string;
	value: string;
	action: string;
	routing?: unknown;
}

export type PlusTardFieldConfig = INodeProperties;

export interface PlusTardResourceModule {
	operations: PlusTardOperationConfig[];
	fields: PlusTardFieldConfig[];
}

export type PlusTardResource = 'posts' | 'media';

export const PLUSTARD_RESOURCES: PlusTardResourceConfig[] = [
	{
		name: 'Posts',
		value: 'posts',
		description:
			'Create, schedule, and manage social media posts across multiple platforms (Twitter/X, Facebook, Instagram, LinkedIn, TikTok, Bluesky, Threads)',
	},
	{
		name: 'Media',
		value: 'media',
		description: 'Upload images and videos for use in your social media posts',
	},
];
