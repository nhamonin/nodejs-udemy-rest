import { signup } from '../controllers/auth.js';

import { userSchema } from '../validation/userSchema.js';

export async function authRoutes(fastify, options) {
  // PUT /auth/signup
  fastify.put('/signup', { schema: userSchema }, signup);
}
