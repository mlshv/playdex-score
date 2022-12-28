import { ConnectKitButton } from "connectkit";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PlaydexLogo } from "./PlaydexLogo";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="flex w-full">
      <div className="flex w-full justify-between">
        <Link href={session?.address ? `/p/${session.address}` : "/"}>
          <PlaydexLogo />
        </Link>
        <ConnectKitButton />
      </div>
    </header>
  );
}
