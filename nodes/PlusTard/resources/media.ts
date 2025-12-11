import type { PlusTardResourceModule } from '../types';

export const mediaResource: PlusTardResourceModule = {
	operations: [
		{
			name: 'Upload',
			value: 'upload',
			action: 'Upload a media file',
			routing: {
				request: {
					method: 'POST',
					url: '/media',
				},
			},
		},
	],

	fields: [
		{
			displayName: 'Binary Property',
			name: 'binaryProperty',
			type: 'string',
			default: 'data',
			displayOptions: {
				show: {
					resource: ['media'],
					operation: ['upload'],
				},
			},
			description:
				'Name of the binary property containing the file to upload. Use the Read Binary File node before this.',
			required: true,
		},
		{
			displayName: 'File Name',
			name: 'fileName',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					resource: ['media'],
					operation: ['upload'],
				},
			},
			description: 'Optional custom filename for the uploaded file',
			placeholder: 'image.jpg',
		},
	],
};
