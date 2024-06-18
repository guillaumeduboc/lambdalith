import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

import { pokemonListItemSchema } from './schemas';

export const getPokemonListContract = new ApiGatewayContract({
  id: 'getPokemonList',
  path: '/swarmion/pokemons',
  method: 'GET',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'array',
      items: pokemonListItemSchema,
    },
  },
});
