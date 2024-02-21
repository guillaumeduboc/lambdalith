import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';

import { appRouter } from './server';

// created for each request
const createContext = () => ({}); // no context

export const main = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
});
