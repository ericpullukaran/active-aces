"use client"

import React from "react"
import Image from "next/image"
import { motion, type Transition } from "motion/react"
import { Settings as SettingsIcon, User2, LogOut } from "lucide-react"
import { useSnapshot } from "valtio"
import { navigationActions, navigationStore } from "~/lib/stores/navigationStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { SignedIn, SignedOut, SignInButton, useClerk, useUser } from "@clerk/nextjs"

const activeIndicatorTransition: Transition = {
  type: "spring",
  ease: "easeOut",
  duration: 0.5,
  bounce: 0.3,
}

export function UserMenuButton() {
  const { user } = useUser()
  const { openUserProfile, signOut } = useClerk()
  const currentPage = useSnapshot(navigationStore).currentPage

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          layout
          style={{ originY: "top" }}
          className="relative flex h-14 w-10 shrink-0 flex-col items-center justify-center p-2"
        >
          <SignedIn>
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName ?? "User avatar"}
                width={24}
                height={24}
                className="h-[24px] w-[24px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <User2 className="shrink-0 text-gray-400" />
            )}
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-gray-700">
                <User2 className="h-4 w-4 text-white" />
              </div>
            </SignInButton>
          </SignedOut>
          {currentPage === "settings" && (
            <motion.div
              className="absolute -bottom-2 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
              transition={activeIndicatorTransition}
              layoutId="activeIndicator"
            />
          )}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => {
            openUserProfile()
          }}
        >
          <User2 className="mr-2 h-4 w-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigationActions.setCurrentPage("settings")
          }}
        >
          <SettingsIcon className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <SignedIn>
          <div className="bg-popover sticky bottom-0 -m-1 p-1">
            <DropdownMenuSeparator className="mb-1" />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                void signOut()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </div>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
