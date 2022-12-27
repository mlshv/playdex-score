import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { scoreRouter } from "./score";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  score: scoreRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
