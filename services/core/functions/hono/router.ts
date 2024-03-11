import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { number, object, string } from 'zod';

import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';

const router = new Hono();

router.get('/hello', c =>
  c.json({
    message: 'hello world',
  }),
);

// add a crud api for pokemons using the dynamodb service
router.get('/pokemons', async c => {
  return c.json(await getPokemonList());
});

router.get('/pokemons/:id', async c => {
  const id = parseInt(c.req.param('id'));

  return c.json(await getPokemonById(id));
});

router.delete('/pokemons/:id', async c => {
  const id = parseInt(c.req.param('id'));

  await deletePokemon(id);

  return c.body(null, 204);
});

router.post(
  '/pokemons',
  zValidator(
    'json',
    object({ name: string(), height: number(), weight: number() }),
  ),
  async c => {
    const pokemon = c.req.valid('json');

    const pokemonInfo = {
      ...pokemon,
      id: Math.ceil(Math.random() * 1000),
    };

    await createPokemon(pokemonInfo);

    return c.json(pokemonInfo, 201);
  },
);

export { router };
