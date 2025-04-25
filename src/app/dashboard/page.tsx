"use client"
import React from "react"
import { useSession } from "@clerk/nextjs"
import RecentWorkoutsCard from "~/components/RecentWorkoutsCard"

export default function DashboardPage() {
  const { session } = useSession()

  return (
    <div className="w-full">
      <div className="mx-4 pb-40">
        <h1 className="mt-4 mb-10 text-4xl leading-10 font-semibold tracking-tight text-white sm:text-6xl">
          Good morning, {session?.user.firstName} <br /> Welcome Back 👋
        </h1>
        <RecentWorkoutsCard />
        {/* <div className="fixed bottom-0 left-0 right-0 grid h-20 place-content-center">
          <StartWorkoutButton />
        </div> */}
      </div>
    </div>
  )
}
