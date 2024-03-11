import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

// move this contract to a shared library once you need to use it outside this service
export const testContract = new ApiGatewayContract({
  id: 'core-test',
  path: '/swarmion/test',
  method: 'GET',
  integrationType: 'restApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { result: { type: 'number' } },
      required: ['result'],
      additionalProperties: false,
    } as const,
  },
});
