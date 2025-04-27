import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db, schema } from "~/lib/db"

export async function GET() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId) {
    redirect("/sign-in")
  }

  const existingUser = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1)

  if (existingUser.length === 0) {
    await db.insert(schema.users).values({
      id: userId,
      name: user?.fullName ?? "User",
    })
  }

  redirect("/dashboard")
}
