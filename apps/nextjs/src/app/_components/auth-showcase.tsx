import { currentUser, SignInButton, SignOutButton } from "@clerk/nextjs";

export async function AuthShowcase() {
  const user = await currentUser();

  if (!user) {
    return (
      <div>
        <SignInButton mode="modal" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {user && <span>Logged in as {user.firstName}</span>}
      </p>

      <div>
        <SignOutButton />
      </div>
    </div>
  );
}
