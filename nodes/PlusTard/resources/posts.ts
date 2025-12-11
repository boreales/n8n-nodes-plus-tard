import type { PlusTardResourceModule } from '../types';
import { postsCreatePreSend } from '../utils/routingHooks';
import {
	buildPlatformSelector,
	buildPageSelectors,
	buildMediaItemsField,
	buildCommonPostFields,
	buildPlatformSpecificFields,
} from '../utils/fieldBuilders';

export const postsResource: PlusTardResourceModule = {
	operations: [
		{
			name: 'Create',
			value: 'create',
			action: 'Create a scheduled post',
			routing: {
				request: {
					method: 'POST',
					url: '/post',
				},
				send: {
					preSend: [postsCreatePreSend],
				},
			},
		},
	],

	fields: [
		// Common post fields
		...buildCommonPostFields(),

		// Platform selection
		buildPlatformSelector(),

		// Page/account selectors for all platforms
		...buildPageSelectors(),

		// Media items
		buildMediaItemsField(),

		// Platform-specific parameters
		...buildPlatformSpecificFields(),
	],
};
