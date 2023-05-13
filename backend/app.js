import fastify from 'fastify';
import Cors from '@fastify/cors';
import { feedRoutes } from './routes/feed.js';

const app = fastify({ logger: true });
app.register(Cors, { origin: '*' });
app.register(feedRoutes, { prefix: '/feed' });

app.listen({ host: '::1', port: 8080 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
