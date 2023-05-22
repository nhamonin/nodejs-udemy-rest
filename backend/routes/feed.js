import {
  getPosts,
  getPost,
  postPost,
  putPost,
  deletePost,
} from '../controllers/feed.js';
import { feedSchema } from '../validation/feed/feedSchema.js';

export async function feedRoutes(fastify, options) {
  // GET /feed/posts
  fastify.get('/posts', getPosts);
  // POST /feed/post
  fastify.post('/post', { schema: feedSchema }, postPost);
  // GET /feed/post/:postId
  fastify.get('/post/:postId', getPost);
  // PUT /feed/post/:postId
  fastify.put('/post/:postId', { schema: feedSchema }, putPost);
  // DELETE /feed/post/:postId
  fastify.delete('/post/:postId', deletePost);
}
