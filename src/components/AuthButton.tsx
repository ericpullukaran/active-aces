import React from "react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

export default function AuthButton() {
  return (
    <>
      <div className="sq-[28px] relative isolate">
        <div className="relative z-10">
          <SignedIn>
            {/* Mount the UserButton component */}
            <UserButton />
          </SignedIn>
        </div>
        <Skeleton className="sq-[28px] absolute top-0 right-0 z-0 rounded-full" />
      </div>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </>
  )
}
