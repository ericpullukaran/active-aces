"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import AuthButton from "./AuthButton";
import Logo from "./Logo";

type Props = {};

export default function NavBar({}: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={clsx(
        "m-2 flex flex-row items-center justify-between rounded-xl bg-card p-3 sm:p-5",
      )}
    >
      <div className="font-display">
        <Link
          className="flex flex-row text-xl font-extrabold tracking-tight"
          href="/"
        >
          <Logo className="h-12 w-12" />
        </Link>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <AuthButton />
      </div>
    </nav>
  );
}
