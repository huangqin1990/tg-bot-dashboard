import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from './config/env';
import categoriesRoute from './routes/categories';
import merchantsRoute from './routes/merchants';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.get('/', (c) => {
  return c.json({ message: 'TG Bot Dashboard API', version: '1.0.0' });
});

app.route('/api/categories', categoriesRoute);
app.route('/api/merchants', merchantsRoute);

app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error' }, 500);
});

console.log(`Server is running on port ${config.port}`);

serve({
  fetch: app.fetch,
  port: config.port,
});