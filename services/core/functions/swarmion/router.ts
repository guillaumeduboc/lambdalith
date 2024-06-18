import { SwarmionRouter } from '@swarmion/serverless-contracts';

import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';

import {
  createPokemonContract,
  deletePokemonContract,
  getPokemonContract,
  getPokemonListContract,
} from './contracts';
import { helloContract } from './contracts/hello';

const router = new SwarmionRouter();

router.add(helloContract)(async () => {
  return Promise.resolve({
    statusCode: 200,
    body: { message: 'hello world' },
  });
});

// add a crud api for pokemons using the dynamodb service
router.add(getPokemonListContract)(async () => {
  return {
    statusCode: 200,
    body: await getPokemonList(),
  };
});

router.add(getPokemonContract)(async ({ pathParameters: { id } }) => {
  return {
    statusCode: 200,
    body: await getPokemonById(parseInt(id)),
  };
});

router.add(deletePokemonContract)(async ({ pathParameters: { id } }) => {
  await deletePokemon(parseInt(id));

  return { statusCode: 204, body: null };
});

router.add(createPokemonContract)(async ({ body }) => {
  const pokemonInfo = {
    ...body,
    id: Math.ceil(Math.random() * 1000),
  };

  await createPokemon(pokemonInfo);

  return { statusCode: 201, body: pokemonInfo };
});

export { router };
