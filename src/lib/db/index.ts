import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { getOperators, getOrderByOperators } from "drizzle-orm"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"
import { env } from "~/env"

declare global {
  // allow global `var` declarations
   
  var db: ReturnType<typeof createDb> | undefined
}

const createDb = () => {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  })

  const db = drizzle(client, { schema })

  return db
}

export type DB = ReturnType<typeof createDb>

/**
 * Filters out any relation definitions from your schema
 */
type SchemaTableNames = {
  [TableOrRelationName in keyof typeof schema]: (typeof schema)[TableOrRelationName] extends SQLiteTableWithColumns<any>
    ? TableOrRelationName
    : never
}[keyof typeof schema]

type DBSelectTypeMap = {
  [TableName in SchemaTableNames]: InferSelectModel<(typeof schema)[TableName]>
}
/**
 * Get the SELECT type for a table given it's export name in the drizzle schema.
 */
export type Doc<TableName extends keyof DBSelectTypeMap> = DBSelectTypeMap[TableName]

type DBInsertTypeMap = {
  [TableName in SchemaTableNames]: InferInsertModel<(typeof schema)[TableName]>
}
/**
 * Get the INSERT type for a table given it's export name in the drizzle schema.
 */
export type DocInsert<TableName extends keyof DBInsertTypeMap> = DBInsertTypeMap[TableName]

export const db = globalThis.db ?? createDb()
export const cmp = getOperators()
export const orderBy = getOrderByOperators()
export { schema }

if (process.env.NODE_ENV !== "production") {
  global.db = db
}
