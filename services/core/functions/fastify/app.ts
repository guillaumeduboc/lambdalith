import fastify from 'fastify';

import { routes } from './router';

const init = (): typeof app => {
  const app = fastify({ logger: true });

  void app.register(routes, { prefix: '/fastify' });

  return app;
};

export { init };
