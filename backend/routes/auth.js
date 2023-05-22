import { signup, login, getStatus, updateStatus } from '../controllers/auth.js';

import { userSchema } from '../validation/userSchema.js';
import isAuthenticated from '../hooks/is-auth.js';

export async function authRoutes(fastify, options) {
  // PUT /auth/signup
  fastify.put('/signup', { schema: userSchema }, signup);
  // POST /auth/login
  fastify.post('/login', login);
  // get /auth/status
  fastify.get('/status', { preHandler: isAuthenticated }, getStatus);
  // put /auth/status
  fastify.put('/status', { preHandler: isAuthenticated }, updateStatus);
}
