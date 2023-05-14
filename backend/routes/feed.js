import feedController from '../controllers/feed.js';

export async function feedRoutes(fastify, options) {
  // GET /feed/posts
  fastify.get('/posts', feedController.getPosts);
  // POST /feed/post
  fastify.post(
    '/post',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 5 },
            content: { type: 'string', minLength: 5 },
          },
          required: ['title', 'content'],
        },
      },
    },
    feedController.postPost
  );
  // GET /feed/post/:postId
  fastify.get('/post/:postId', feedController.getPost);
}
