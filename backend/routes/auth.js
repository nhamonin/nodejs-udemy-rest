import { signup, login } from '../controllers/auth.js';

import { userSchema } from '../validation/userSchema.js';

export async function authRoutes(fastify, options) {
  // PUT /auth/signup
  fastify.put('/signup', { schema: userSchema }, signup);
  // POST /auth/login
  fastify.post('/login', login);
}
