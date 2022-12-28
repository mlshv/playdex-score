import { Header } from "./Header";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="relative mx-auto min-h-screen max-w-[1000px] overflow-hidden px-2 pt-4 pb-12 md:px-8">
      <img
        src="/bg1440x900.svg"
        alt=""
        className="pointer-events-none absolute inset-0 z-[-1]"
      />
      <Header />
      <main className="mt-6">{children}</main>
    </div>
  );
}
