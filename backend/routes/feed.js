import feedController from '../controllers/feed.js';

export async function feedRoutes(fastify, options) {
  // GET /feed/posts
  fastify.get('/posts', feedController.getPosts);
  // POST /feed/post
  fastify.post('/post', feedController.postPost);
}
