"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "./ui/button";

export default function NavBackButton({
  navigateBack = "/dashboard",
}: {
  navigateBack?: string;
}) {
  const searchParams = useSearchParams();
  const cameFromInternalPage = searchParams.get("internalNav");
  const router = useRouter();

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        if (cameFromInternalPage) {
          router.back();
        } else {
          router.push(navigateBack);
        }
      }}
      variant="outline"
      size="icon"
      asChild
      className="sq-8 group bg-card"
    >
      <Link href={navigateBack}>
        <ArrowLeft className="sq-5 transition-transform group-hover:-translate-x-0.5" />
      </Link>
    </Button>
  );
}
