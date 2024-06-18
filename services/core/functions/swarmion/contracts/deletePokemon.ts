import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const deletePokemonContract = new ApiGatewayContract({
  id: 'deletePokemon',
  path: '/swarmion/pokemons/{id}',
  method: 'DELETE',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.NO_CONTENT]: {
      type: 'null',
    },
  },
  pathParametersSchema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  } as const,
});
