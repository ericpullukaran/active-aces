"use client"

import React from "react"
import AuthButton from "./AuthButton"
import Logo from "./Logo"

export default function NavBar() {
  return (
    <nav className="bg-card/80 fixed top-0 right-4 left-4 z-10 flex items-center justify-between rounded-b-2xl px-4 py-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center">
          <Logo className="sq-2 bg-transparent" />
        </div>
        <span className="text-lg font-bold">Active Aces</span>
      </div>

      <div>
        <AuthButton />
      </div>
    </nav>
  )
}
