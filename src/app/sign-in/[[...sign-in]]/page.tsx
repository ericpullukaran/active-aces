import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="grid flex-1 place-items-center">
      <div className="w-ful absolute top-0 right-0 bottom-0 left-0 h-full bg-zinc-100/20"></div>
      <SignIn signUpUrl="/sign-up" />
    </div>
  )
}
