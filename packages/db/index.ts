import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { getOperators, getOrderByOperators } from "drizzle-orm";
import * as schema from "./schema";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof createDb> | undefined;
}

const createDb = () => {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const db = drizzle(client, { schema });

  return Object.assign(db, {
    $schema: schema,
    $cmp: getOperators(),
    $order: getOrderByOperators(),
  });
};

export const db = globalThis.db ?? createDb();
export { schema };
export * from "./types";

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}
