import { db } from "@acme/db";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";
import type { User } from "@clerk/nextjs/api";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type AuthContextProps = {
  auth: SignedInAuthObject | SignedOutAuthObject;
  user: User | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createContextInner = async ({ auth, user }: AuthContextProps) => {
  return {
    auth,
    user,
    db,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  async function getUser() {
    // get userId from request
    const auth = getAuth(opts.req);
    // get full user object
    const user = auth.userId
      ? await clerkClient.users.getUser(auth.userId)
      : null;
    return { auth, user };
  }
  const { auth, user } = await getUser();
  return await createContextInner({ auth, user });
};

export type Context = inferAsyncReturnType<typeof createContext>;
