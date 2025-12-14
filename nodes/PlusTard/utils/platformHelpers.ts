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
		this.logger.debug(`[PlusTard] Loading accounts for platform: ${platform}`);

		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'plusTardAPIApi',
			{
				method: 'GET',
				url: 'https://plus-tard.com/api/user_providers',
				headers: {
					Accept: 'application/ld+json',
					'Content-Type': 'application/ld+json',
				},
			},
		)) as { 'hydra:member'?: unknown[] } | unknown[];

		this.logger.debug('[PlusTard] Raw API response:', { response: JSON.stringify(response, null, 2) });
		this.logger.debug(`[PlusTard] Response type: ${typeof response}, Is array: ${Array.isArray(response)}`);

		// Extract user providers from response
		const userProviders = Array.isArray(response)
			? response
			: (response as any).member || response['hydra:member'] || [];

		this.logger.debug(`[PlusTard] Found ${userProviders.length} user providers`);

		// Filter providers by platform and extract their accounts
		const platformAccounts: INodePropertyOptions[] = [];

		for (const provider of userProviders) {
			const prov = provider as { provider?: string; accounts?: unknown[]; username?: string; '@id'?: string };

			this.logger.debug(`[PlusTard] Provider: ${prov.provider}, Accounts: ${(prov.accounts || []).length}`);

			// Check if this provider matches the requested platform
			if (prov.provider?.toLowerCase() === platform.toLowerCase()) {
				const accounts = prov.accounts || [];

				// If the provider has accounts, add them
				if (accounts.length > 0) {
					for (const account of accounts) {
						const acc = account as { name?: string; accountId?: string; '@id'?: string };
						platformAccounts.push({
							name: acc.name || acc.accountId || acc['@id'] || 'Unknown',
							value: acc['@id'] || acc.accountId || '',
						});
					}
				} else {
					// If no accounts, use the provider itself (username as name, @id as value)
					platformAccounts.push({
						name: prov.username || prov['@id'] || 'Unknown',
						value: prov['@id'] || '',
					});
				}
			}
		}

		this.logger.debug(`[PlusTard] Returning ${platformAccounts.length} accounts for platform ${platform}`);

		return platformAccounts;
	} catch (error) {
		this.logger.error('[PlusTard] Error loading accounts:', {
			error: error instanceof Error ? error.message : String(error),
			platform,
			stack: error instanceof Error ? error.stack : undefined
		});
		// Return empty array if accounts can't be loaded
		return [];
	}
}
