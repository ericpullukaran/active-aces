import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  SQLiteTableFn,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";

import type { schema } from "@acme/db";

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
