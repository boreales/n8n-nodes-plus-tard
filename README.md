# n8n-nodes-plus-tard

This is an n8n community node for [Plus Tard](https://plus-tard.com) — a social media scheduling platform. It lets you schedule and manage posts across multiple platforms directly from your n8n workflows.

## Supported Platforms

- Twitter/X
- Facebook
- Instagram
- LinkedIn
- TikTok
- Bluesky
- Threads

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Authentication

1. Log in to your [Plus Tard](https://plus-tard.com) account.
2. Generate an API key from your account settings.
3. In n8n, create a new **Plus Tard API** credential and paste your API key.

## Operations

### Post

- **Create** — Schedule a new social media post. Select target platforms and pages, set the text content, attach media, and choose when to publish. Supports platform-specific options like Twitter thread mode and TikTok privacy settings.

### Media

- **Upload** — Upload an image or video file for use in posts. Use the **Read Binary File** node before this operation to load the file into n8n.

## Usage Example

1. Add a **Read Binary File** node to load an image.
2. Add a **Plus Tard** node with the **Media → Upload** operation to upload it.
3. Add another **Plus Tard** node with the **Post → Create** operation, referencing the uploaded media URL and setting your desired schedule.

## Resources

- [Plus Tard website](https://plus-tard.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
