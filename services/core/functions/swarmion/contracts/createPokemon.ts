import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { pokemonSchema } from './schemas';

export const createPokemonContract = new ApiGatewayContract({
  id: 'createPokemon',
  path: '/swarmion/pokemons',
  method: 'POST',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.CREATED]: pokemonSchema,
  },
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      height: { type: 'number' },
      weight: { type: 'number' },
    },
    required: ['name', 'height', 'weight'],
  } as const,
});
