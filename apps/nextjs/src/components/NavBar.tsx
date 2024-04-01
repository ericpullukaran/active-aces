"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";

import AuthButton from "./AuthButton";
import Logo from "./Logo";
import NavBackButton from "./NavBackButton";

type Props = {
  title: string;
  navigateBack?: string;
  rightSideContent?: React.ReactNode;
};

export default function NavBar({
  title,
  navigateBack,
  rightSideContent,
}: Props) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  return (
    <div className="pb-24 md:pb-6">
      <nav
        className={clsx(
          "fixed left-4 right-4 z-50 flex h-20 items-center rounded-b-xl bg-card p-4 ring-2 ring-zinc-700 md:static",
        )}
      >
        {navigateBack ? (
          <NavBackButton navigateBack={navigateBack} />
        ) : (
          <div className="font-display">
            <Link
              className="flex flex-row text-xl font-extrabold tracking-tight"
              href="/dashboard"
            >
              <Logo className="h-10 w-10" />
            </Link>
          </div>
        )}

        <div className="flex-1 truncate px-3 text-xl font-semibold">
          {title}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {rightSideContent}

          {isLoaded ? (
            <AuthButton />
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-600"></div>
          )}
        </div>
      </nav>
    </div>
  );
}
