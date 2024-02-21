import { Hono } from 'hono';

const router = new Hono();

router.get('/hello', c =>
  c.json({
    message: 'hello world',
  }),
);

export { router };
