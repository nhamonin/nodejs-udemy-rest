import { getPosts, getPost, postPost } from '../controllers/feed.js';

export async function feedRoutes(fastify, options) {
  // GET /feed/posts
  fastify.get('/posts', getPosts);
  // POST /feed/post
  fastify.post(
    '/post',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            title: {
              type: 'object',
              properties: {
                value: { type: 'string' },
              },
            },
            content: {
              type: 'object',
              properties: {
                value: { type: 'string' },
              },
            },
            image: {
              type: 'object',
              properties: {
                filename: { type: 'string' },
              },
            },
          },
          required: ['title', 'content', 'image'],
        },
      },
    },
    postPost
  );

  // GET /feed/post/:postId
  fastify.get('/post/:postId', getPost);
}
