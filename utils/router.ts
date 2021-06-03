import * as T from "fp-ts/Task";
import { NextRouter } from "next/router";

export const push =
  (path: string) =>
  (router: NextRouter): T.Task<boolean> =>
  () =>
    router.push(path);
