import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  SQLiteTableFn,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import { createClient } from "@libsql/client";
import { getOperators, getOrderByOperators } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema/schema";

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

export type DBSelectTypes = {
  [K in keyof typeof schema]: (typeof schema)[K] extends SQLiteTableWithColumns<
    ReturnType<SQLiteTableFn>
  >
    ? InferSelectModel<(typeof schema)[K]>
    : never;
};
export type DBInsertTypes = {
  [K in keyof typeof schema]: (typeof schema)[K] extends SQLiteTableWithColumns<
    ReturnType<SQLiteTableFn>
  >
    ? InferInsertModel<(typeof schema)[K]>
    : never;
};

export type Doc<T extends keyof DBSelectTypes> = DBSelectTypes[T];
export type DocInsert<T extends keyof DBInsertTypes> = DBInsertTypes[T];

export const db = globalThis.db ?? createDb();
export { schema };

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}
