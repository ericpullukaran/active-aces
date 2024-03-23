"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";

import AuthButton from "./AuthButton";
import Logo from "./Logo";

type Props = {};

export default function NavBar({}: Props) {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  return (
    <nav
      className={clsx("m-2 flex items-center rounded-xl bg-card p-3 sm:p-5")}
    >
      <div className="font-display">
        <Link
          className="flex flex-row text-xl font-extrabold tracking-tight"
          href="/dashboard"
        >
          <Logo className="h-10 w-10" />
        </Link>
      </div>

      <div className="ml-4 flex-1">
        <p className="text-sm text-zinc-300">Welcome back! 👋</p>
        {isLoaded && user ? (
          <h4 className="font-semibold">{user.firstName}</h4>
        ) : (
          <div className="h-6 w-28 animate-pulse rounded-sm bg-zinc-600"></div>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <AuthButton />
        {!isLoaded && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-600"></div>
        )}
      </div>
    </nav>
  );
}
