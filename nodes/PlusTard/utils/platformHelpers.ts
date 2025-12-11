import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

export const SUPPORTED_PLATFORMS = [
	{
		name: 'Twitter/X',
		value: 'twitter',
		displayName: 'Twitter/X Accounts',
	},
	{
		name: 'Facebook',
		value: 'facebook',
		displayName: 'Facebook Pages',
	},
	{
		name: 'Instagram',
		value: 'instagram',
		displayName: 'Instagram Accounts',
	},
	{
		name: 'LinkedIn',
		value: 'linkedin',
		displayName: 'LinkedIn Accounts',
	},
	{
		name: 'TikTok',
		value: 'tiktok',
		displayName: 'TikTok Accounts',
	},
	{
		name: 'Bluesky',
		value: 'bluesky',
		displayName: 'Bluesky Accounts',
	},
	{
		name: 'Threads',
		value: 'threads',
		displayName: 'Threads Accounts',
	},
];

/**
 * Load platform accounts dynamically from Plus Tard API
 */
export async function loadPlatformAccounts(
	this: ILoadOptionsFunctions,
	platform: string,
): Promise<INodePropertyOptions[]> {
	try {
		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'plusTardAPIApi',
			{
				method: 'GET',
				url: '/user_providers',
				headers: {
					Accept: 'application/ld+json',
					'Content-Type': 'application/ld+json',
				},
			},
		)) as { 'hydra:member'?: unknown[] } | unknown[];

		// Extract accounts from response
		const accounts = Array.isArray(response) ? response : response['hydra:member'] || [];

		// Filter accounts by platform and map to options
		return accounts
			.filter((account: unknown) => {
				const acc = account as { provider?: string };
				return acc.provider?.toLowerCase() === platform.toLowerCase();
			})
			.map((account: unknown) => {
				const acc = account as { name?: string; title?: string; id?: string; '@id'?: string };
				return {
					name: acc.name || acc.title || acc.id || 'Unknown',
					value: acc.id || acc['@id'] || '',
				};
			});
	} catch {
		// Return empty array if accounts can't be loaded
		return [];
	}
}
