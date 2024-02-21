import awsLambdaFastify from '@fastify/aws-lambda';

import { init } from './app';

export const main = awsLambdaFastify(init());
