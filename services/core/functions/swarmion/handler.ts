import { handle } from '@swarmion/serverless-contracts';

import { router } from './router';

export const main = handle(router);
