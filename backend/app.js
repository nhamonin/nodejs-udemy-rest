import fastify from 'fastify';
import { feedRoutes } from './routes/feed.js';

const app = fastify({ logger: true });
app.register(feedRoutes, { prefix: '/feed' });

app.addHook('onRequest', async (request, reply) => {
  reply.headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
});

app.listen({ host: '::1', port: 8080 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
