import { handle } from 'hono/aws-lambda';

import { app } from './app';

export const main = handle(app);
