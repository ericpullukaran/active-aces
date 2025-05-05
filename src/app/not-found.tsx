import React from "react"
import Link from "next/link"

import { Button } from "~/components/ui/button"

export default function NotFound404() {
  return (
    <main className="bg-background grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-primary text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
