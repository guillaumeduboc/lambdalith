import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { pokemonSchema } from './schemas';

export const getPokemonContract = new ApiGatewayContract({
  id: 'getPokemon',
  path: '/swarmion/pokemons/{id}',
  method: 'GET',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: pokemonSchema,
  },
  pathParametersSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  } as const,
});
