import fastify from 'fastify';
import { feedRoutes } from './routes/feed.js';

const app = fastify({ logger: true });
app.register(feedRoutes, { prefix: '/feed' });

app.listen({ host: '::1', port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
