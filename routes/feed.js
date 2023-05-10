import feedController from '../controllers/feed.js';

export async function feedRoutes(fastify, options) {
  fastify.get('/posts', feedController.getPosts);
}
