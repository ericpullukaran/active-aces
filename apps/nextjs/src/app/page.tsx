import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { Button } from "~/components/ui/button";

export const runtime = "edge";

export default async function HomePage() {
  return (
    <main>
      <div className="absolute h-[400px] w-full">
        <div className="absolute bottom-1/2 left-0 right-0 top-0 z-[2] bg-gradient-to-b from-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 z-[1] bg-gradient-to-t from-background to-transparent"></div>
        <Image
          src={"/stock_images/AdobeStock_178823736.jpeg"}
          alt="Image of Man and Woman lifting weights"
          fill
          objectFit="cover"
        />
      </div>
      <div className="container relative z-20 h-screen py-12">
        <div className="mb-[250px] flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-[3rem]">
            Active <span className="text-primary">Aces</span>
          </h1>
        </div>
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <h2 className="mb-4 max-w-lg text-left text-4xl font-bold sm:text-center">
            Empower Your Journey, Transform Your Body.
          </h2>
          <p className="mb-4 text-left text-zinc-500 sm:text-center">
            Track your workouts and fitness activities effortlessly with our
            app, designed to keep you motivated and on track towards your goals.
          </p>
          <Link
            href={"/privacy-policy?ref=activeaces.com"}
            className="mb-4 text-left underline sm:text-center"
          >
            Privacy Policy
          </Link>
          <div className="fixed bottom-0 left-0 right-0 w-full bg-card p-4 sm:static sm:flex sm:flex-col sm:justify-center sm:bg-transparent">
            <SignedIn>
              <Button asChild>
                <Link href={"/dashboard"} className="mb-2 w-full">
                  Go to Dashboard
                </Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="mb-2 w-full">Get Started</Button>
              </SignInButton>
              <p className="text-center text-sm text-zinc-500">
                Don&apos;t have an account yet?{" "}
                <Link href={"/sign-up"} className="text-primary">
                  Sign Up
                </Link>
              </p>
            </SignedOut>
          </div>
        </div>
      </div>
    </main>
  );
}
