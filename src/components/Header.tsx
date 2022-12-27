import { ConnectWallet } from "./ConnectWallet";

export function Header() {
  return (
    <header className="flex p-2">
      <div className="flex">
        <ConnectWallet />
      </div>
    </header>
  );
}
