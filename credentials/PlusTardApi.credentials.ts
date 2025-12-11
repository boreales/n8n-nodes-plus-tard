import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class PlusTardApi implements ICredentialType {
	name = 'plusTardAPIApi';
	icon: Icon = 'file:./plustard.svg';
	displayName = 'Plus Tard API';
	documentationUrl = 'https://plus-tard.com/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				'Your Plus Tard API key. Generate one from your Plus Tard dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Optional: Test credentials
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://plus-tard.com/api',
			url: '/image_posts',
			method: 'GET',
		},
	};
}