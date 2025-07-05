import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"])

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, redirectToSignIn } = await auth()
    if (!userId && isProtectedRoute(req)) {
      return redirectToSignIn({ returnBackUrl: "/dashboard" })
    }
  },
  {
    signInUrl: "/sign-in",
    signUpUrl: "/sign-up",
  },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
