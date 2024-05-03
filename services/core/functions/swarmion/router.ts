import { HttpStatusCodes } from '@swarmion/serverless-contracts';

import { helloContract } from 'contracts/helloContract';
import {
  createPokemonContract,
  deletePokemonContract,
  getPokemonContract,
  pokemonListContract,
} from 'contracts/pokemonContract';
import { testContract } from 'contracts/testContract';
import {
  createPokemon,
  deletePokemon,
  getPokemonById,
  getPokemonList,
} from 'services/dynamodb';
import { fibonacci } from 'services/fibonacci';

import { SwarmionRouter } from './swarmionRouter';

const router = new SwarmionRouter();

router.add(helloContract)(async () => {
  return Promise.resolve({
    statusCode: HttpStatusCodes.OK,
    body: { message: 'hello world' },
  });
});

// add a crud api for pokemons using the dynamodb service
router.add(pokemonListContract)(async () => {
  const pokemonList = await getPokemonList();

  return { statusCode: HttpStatusCodes.OK, body: pokemonList };
});

router.add(getPokemonContract)(async ({ pathParameters: { id } }) => {
  const pokemonInfo = await getPokemonById(parseInt(id));

  return { statusCode: HttpStatusCodes.OK, body: pokemonInfo };
});

router.add(deletePokemonContract)(async ({ pathParameters: { id } }) => {
  await deletePokemon(parseInt(id));

  return { statusCode: HttpStatusCodes.NO_CONTENT, body: null };
});

router.add(createPokemonContract)(async ({ body: pokemon }) => {
  const pokemonInfo = {
    ...pokemon,
    id: Math.ceil(Math.random() * 1000),
  };

  await createPokemon(pokemonInfo);

  return { statusCode: HttpStatusCodes.CREATED, body: pokemonInfo };
});

router.add(testContract)(async () => {
  return Promise.resolve({
    statusCode: HttpStatusCodes.OK,
    body: {
      result: fibonacci(10),
    },
  });
});

export { router };
