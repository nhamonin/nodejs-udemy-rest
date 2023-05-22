import {
  getPosts,
  getPost,
  postPost,
  putPost,
  deletePost,
} from '../controllers/feed.js';
import { feedSchema } from '../validation/feedSchema.js';
import isAuthenticated from '../hooks/is-auth.js';

export async function feedRoutes(fastify, options) {
  // GET /feed/posts
  fastify.get('/posts', { preHandler: isAuthenticated }, getPosts);
  // POST /feed/post
  fastify.post(
    '/post',
    { preHandler: isAuthenticated, schema: feedSchema },
    postPost
  );
  // GET /feed/post/:postId
  fastify.get('/post/:postId', { preHandler: isAuthenticated }, getPost);
  // PUT /feed/post/:postId
  fastify.put(
    '/post/:postId',
    { preHandler: isAuthenticated, schema: feedSchema },
    putPost
  );
  // DELETE /feed/post/:postId
  fastify.delete('/post/:postId', { preHandler: isAuthenticated }, deletePost);
}
