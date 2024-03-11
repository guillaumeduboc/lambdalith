import { router } from './router';
import { handle } from './swarmionRouter';

export const main = handle(router);
