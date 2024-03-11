import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

const pokemonEntity = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
  },
  required: ['id', 'name'],
  additionalProperties: false,
} as const;

const PokemonInfo = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    weight: { type: 'number' },
    height: { type: 'number' },
  },
  required: ['id', 'name', 'weight', 'height'],
  additionalProperties: false,
} as const;

const pokemonListEntity = {
  type: 'array',
  items: pokemonEntity,
} as const;

// move this contract to a shared library once you need to use it outside this service
export const pokemonListContract = new ApiGatewayContract({
  id: 'pokemon-list',
  path: '/swarmion/pokemons',
  method: 'GET',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: pokemonListEntity,
  },
});

export const getPokemonContract = new ApiGatewayContract({
  id: 'pokemon-item',
  path: '/swarmion/pokemons/{id}',
  pathParametersSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    additionalProperties: false,
  } as const,
  method: 'GET',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: PokemonInfo,
  },
});

export const deletePokemonContract = new ApiGatewayContract({
  id: 'pokemon-delete',
  path: '/swarmion/pokemons/{id}',
  method: 'DELETE',
  pathParametersSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    additionalProperties: false,
  } as const,
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.NO_CONTENT]: {
      type: 'null',
    } as const,
  },
});

export const createPokemonContract = new ApiGatewayContract({
  id: 'pokemon-create',
  path: '/swarmion/pokemons',
  method: 'POST',
  integrationType: 'httpApi',
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      weight: { type: 'number' },
      height: { type: 'number' },
    },
    required: ['name', 'weight', 'height'],
    additionalProperties: false,
  } as const,
  outputSchemas: {
    [HttpStatusCodes.CREATED]: PokemonInfo,
  },
});
