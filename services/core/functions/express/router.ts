import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { number, object, string } from 'zod';
import { validateRequest } from 'zod-express-middleware';

import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';

const router = Router();
router.get('/hello', (_req, res) => {
  res.json({ message: 'hello world' });
});

// add a crud api for pokemons using the dynamodb service
router.get(
  '/pokemons',
  expressAsyncHandler(async (_req, res) => {
    res.json(await getPokemonList());
  }),
);

router.get(
  '/pokemons/:id',
  validateRequest({ params: object({ id: string() }) }),
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    res.json(await getPokemonById(parseInt(id)));
  }),
);

router.delete(
  '/pokemons/:id',
  validateRequest({ params: object({ id: string() }) }),
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    await deletePokemon(parseInt(id));

    res.sendStatus(204);
  }),
);

router.post(
  '/pokemons',
  validateRequest({
    body: object({ name: string(), height: number(), weight: number() }),
  }),
  expressAsyncHandler(async (req, res) => {
    const pokemon = req.body;

    const pokemonInfo = {
      ...pokemon,
      id: Math.ceil(Math.random() * 1000),
    };

    await createPokemon(pokemonInfo);

    res.status(201).json(pokemonInfo);
  }),
);

export { router };
