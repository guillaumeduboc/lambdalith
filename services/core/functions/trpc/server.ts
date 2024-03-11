import { initTRPC } from '@trpc/server';
import { number, object, string } from 'zod';

import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';

export const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return {
      message: 'hello world',
    };
  }),

  pokemon: t.router({
    list: t.procedure.query(() => getPokemonList()),
    byId: t.procedure
      .input(object({ id: number() }))
      .query(({ input: { id } }) => getPokemonById(id)),
    delete: t.procedure
      .input(object({ id: number() }))
      .mutation(({ input: { id } }) => deletePokemon(id)),
    create: t.procedure
      .input(object({ name: string(), height: number(), weight: number() }))
      .mutation(async ({ input }) => {
        const pokemonInfo = {
          ...input,
          id: Math.ceil(Math.random() * 1000),
        };

        await createPokemon(pokemonInfo);

        return pokemonInfo;
      }),
  }),
});

export { appRouter };
