import serverlessExpress from '@codegenie/serverless-express';

import { app } from './app';

export const main = serverlessExpress({
  app,
  logSettings: {
    level: 'debug', // default: 'error'
  },
});
