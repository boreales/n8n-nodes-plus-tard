import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class PlusTard implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Plus Tard',
        name: 'plusTard',
        icon: 'file:nasapics.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
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
            baseURL: 'https://plus-tard.com/api',
            headers: {
                Accept: 'application/ld+json',
                'Content-Type': 'application/ld+json',
            },
        },
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Create Post',
                        value: 'createPost',
                        action: 'Create a scheduled post',
                        description: 'Post text or picture on your social media accounts',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/post',
                            },
                        },
                    },
                ],
                default: 'createPost',
            },
            {
                displayName: 'Text',
                name: 'text',
                type: 'string',
                default: '',
                required: true,
                description: 'The text content of the post',
                routing: {
                    send: {
                        type: 'body',
                        property: 'text',
                    },
                },
            },
            {
                displayName: 'Provider',
                name: 'provider',
                type: 'string',
                default: '',
                required: true,
                description: 'The social media provider',
                routing: {
                    send: {
                        type: 'body',
                        property: 'provider',
                    },
                },
            },
            {
                displayName: 'Planned At',
                name: 'plannedAt',
                type: 'dateTime',
                default: '',
                required: true,
                description: 'When to publish the post',
                routing: {
                    send: {
                        type: 'body',
                        property: 'plannedAt',
                    },
                },
            },
            {
                displayName: 'Page ID',
                name: 'pageId',
                type: 'string',
                default: '',
                required: true,
                description: 'The ID of the page to post to',
                routing: {
                    send: {
                        type: 'body',
                        property: 'pageId',
                    },
                },
            },
            {
                displayName: 'Image Posts',
                name: 'imagePosts',
                type: 'string',
                default: '',
                description: 'Comma-separated list of image URLs',
                routing: {
                    send: {
                        type: 'body',
                        property: 'imagePosts',
                        preSend: [
                            async function(this, requestOptions) {
                                if (!requestOptions.body) {
                                    requestOptions.body = {};
                                }
                                const imagePosts = this.getNodeParameter('imagePosts', 0) as string;
                                if (imagePosts) {
                                    (requestOptions.body as any).imagePosts = imagePosts.split(',').map(url => url.trim());
                                } else {
                                    (requestOptions.body as any).imagePosts = [];
                                }
                                return requestOptions;
                            },
                        ],
                    },
                },
            },
            {
                displayName: 'TikTok Parameters',
                name: 'tiktokParams',
                type: 'string',
                default: '',
                description: 'Comma-separated list of TikTok parameters',
                routing: {
                    send: {
                        type: 'body',
                        property: 'tiktokParams',
                        preSend: [
                            async function(this, requestOptions) {
                                if (!requestOptions.body) {
                                    requestOptions.body = {};
                                }
                                const tiktokParams = this.getNodeParameter('tiktokParams', 0) as string;
                                if (tiktokParams) {
                                    (requestOptions.body as any).tiktokParams = tiktokParams.split(',').map(param => param.trim());
                                } else {
                                    (requestOptions.body as any).tiktokParams = [];
                                }
                                return requestOptions;
                            },
                        ],
                    },
                },
            },
            {
                displayName: 'Twitter Parameters',
                name: 'twitterParams',
                type: 'string',
                default: '',
                description: 'Comma-separated list of Twitter parameters',
                routing: {
                    send: {
                        type: 'body',
                        property: 'twitterParams',
                        preSend: [
                            async function(this, requestOptions) {
                                if (!requestOptions.body) {
                                    requestOptions.body = {};
                                }
                                const twitterParams = this.getNodeParameter('twitterParams', 0) as string;
                                if (twitterParams) {
                                    (requestOptions.body as any).twitterParams = twitterParams.split(',').map(param => param.trim());
                                } else {
                                    (requestOptions.body as any).twitterParams = [];
                                }
                                return requestOptions;
                            },
                        ],
                    },
                },
            },
        ]
    };
}