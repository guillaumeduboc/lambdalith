import type { FastifyPluginCallback } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { number, object, string } from 'zod';

import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';
import { fibonacci } from 'services/fibonacci';

export const routes: FastifyPluginCallback = (_fastify, _opts, done): void => {
  const fastify = _fastify.withTypeProvider<ZodTypeProvider>();

  fastify.get('/hello', () => {
    return { message: 'hello world' };
  });

  // add a crud api for pokemons using the dynamodb service
  fastify.get('/pokemons', async () => {
    return getPokemonList();
  });

  fastify.get(
    '/pokemons/:id',
    { schema: { params: object({ id: string() }) } },
    async request => {
      const { id } = request.params;

      return getPokemonById(parseInt(id));
    },
  );

  fastify.delete(
    '/pokemons/:id',
    { schema: { params: object({ id: string() }) } },
    async (request, reply) => {
      const { id } = request.params;

      await deletePokemon(parseInt(id));

      return reply.status(204).send();
    },
  );

  fastify.post(
    '/pokemons',
    {
      schema: {
        body: object({ name: string(), height: number(), weight: number() }),
      },
    },
    async (request, response) => {
      const pokemon = request.body;

      const pokemonInfo = {
        ...pokemon,
        id: Math.ceil(Math.random() * 1000),
      };

      await createPokemon(pokemonInfo);

      return response.status(201).send(pokemonInfo);
    },
  );

  fastify.get('/test', () => {
    return {
      result: fibonacci(30),
    };
  });
  done();
};
