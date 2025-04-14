import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-16 h-16", // Adjust width and height as needed
            },
          }}
        />
      </SignedIn>
    </header>
  );
}
