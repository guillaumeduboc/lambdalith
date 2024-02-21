import type { FastifyPluginCallback } from 'fastify';

export const routes: FastifyPluginCallback = (fastify, _opts, done): void => {
  fastify.get('/hello', () => {
    return { message: 'hello world' };
  });

  done();
};
