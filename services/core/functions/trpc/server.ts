import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return {
      message: 'hello world',
    };
  }),
});

export { appRouter };
