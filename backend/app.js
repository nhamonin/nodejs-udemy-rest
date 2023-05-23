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
