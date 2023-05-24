import path from 'node:path';

import fastify from 'fastify';
import Cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mercurius from 'mercurius';

import envToLogger from './utils/logger.js';
import schema from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import isAuthenticated from './hooks/auth.js';
import { saveImage } from './utils/saveImage.js';
import { clearImage } from './utils/clearImage.js';

dotenv.config();

const app = fastify({
  logger: { ...(envToLogger[process.env.environment] ?? true) },
});

app.register(fastifyStatic, {
  root: path.join(path.resolve(), 'backend/images'),
  prefix: '/backend/images/',
});
app.register(fastifyMultipart, {
  attachFieldsToBody: true,
  limits: { fileSize: 1024 * 1024 * 10 },
});
app.register(Cors, { origin: '*' });
app.addHook('preHandler', isAuthenticated);
app.put('/post-image', async (req, reply) => {
  const { image } = req.body;
  if (!reply.isAuth) {
    return reply.code(401).send({ message: 'Not authenticated!' });
  }
  if (!image) {
    return reply.code(400).send({ message: 'No image provided!' });
  }
  if (!image.mimetype.includes('image')) {
    return reply.code(400).send({ message: 'Invalid image!' });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  const newName = await saveImage(image);
  reply.code(201);
  return { message: 'File uploaded!', path: `backend/images/${newName}` };
});
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

try {
  await mongoose.connect(process.env.MONGODB_URI);
  app.log.info('Connected to MongoDB');

  app.listen({ host: '::1', port: 8080 }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
} catch (err) {
  app.log.error(err);
}
