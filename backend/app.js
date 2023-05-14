import path from 'node:path';

import fastify from 'fastify';
import Cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { feedRoutes } from './routes/feed.js';

dotenv.config();

const app = fastify({ logger: true });

try {
  mongoose.connect(process.env.MONGODB_URI);
  app.log.info('Connected to MongoDB');
} catch (err) {
  app.log.error(err);
}
app.register(fastifyStatic, {
  root: path.join(path.resolve(), 'backend/images'),
  prefix: '/backend/images/',
});
app.register(Cors, { origin: '*' });
app.register(feedRoutes, { prefix: '/feed' });

app.listen({ host: '::1', port: 8080 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
