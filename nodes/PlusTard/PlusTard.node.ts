import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class NasaPics implements INodeType {
	description: INodeTypeDescription = {
        displayName: 'Plus Tard',
        name: 'plusTard',
        icon: 'file:nasapics.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Use Plus Tard API to schedule posts on social medias',
        defaults: {
            name: 'Plus Tard',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'PlusTardAPI',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://plus-tard.com/fr/api',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
		properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Astronomy Picture of the Day',
                        value: 'astronomyPictureOfTheDay',
                    },
                    {
                        name: 'Mars Rover Photos',
                        value: 'marsRoverPhotos',
                    },
                ],
                default: 'astronomyPictureOfTheDay',
            },
            {
                displayName: 'Post on Social Media',
                name: 'postSocialMedia',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                        action: 'Post on Social Media',
                        description: 'Post text or picture on your social media accounts',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/post',
                            },
                        },
                    },
                ],
                default: 'post',
            },
		]
	};
}