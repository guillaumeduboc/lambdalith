import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const helloContract = new ApiGatewayContract({
  id: 'hello',
  path: '/swarmion/hello',
  method: 'GET',
  integrationType: 'httpApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
    } as const,
  },
});
