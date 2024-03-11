import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { routes } from './router';

const init = (): typeof app => {
  const app = fastify({ logger: true });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  void app.register(routes, { prefix: '/fastify' });

  return app;
};

export { init };
