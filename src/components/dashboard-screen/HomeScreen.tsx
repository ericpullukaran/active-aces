"use client"
import { useSession } from "@clerk/nextjs"
import RecentWorkoutsCard from "../RecentWorkoutsCard"
import { getTimeOfDay } from "~/lib/utils/dates"
export function HomeScreen() {
  const { session } = useSession()

  return (
    <>
      <h1 className="mt-4 mb-10 text-4xl leading-10 font-semibold tracking-tight text-white sm:text-6xl">
        Good {getTimeOfDay().toLowerCase()}, {session?.user.firstName} <br /> Welcome Back 👋
      </h1>
      <RecentWorkoutsCard />
    </>
  )
}
