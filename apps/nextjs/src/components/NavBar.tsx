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
  const isWorkoutPage = "/dashboard/workout" === pathname;
  console.log("xx", pathname);

  return (
    <div className="pb-20 md:pb-6">
      <nav
        className={clsx(
          "bg-card-darker fixed left-0 right-0 z-50 flex items-center border-b-2 p-3.5 px-5 ring-zinc-700 md:static",
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
              <Logo className="h-7 w-7" />
            </Link>
          </div>
        )}

        <div className="flex-1 truncate px-3 pl-3 text-xl font-semibold">
          {title}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {rightSideContent}
          {!isWorkoutPage && (
            <>
              {isLoaded ? (
                <AuthButton />
              ) : (
                <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-600"></div>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
