import { type NextPage } from "next";
import Head from "next/head";
import cn from "classnames";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { ConnectWallet, Layout, PlaydexLogo } from "../components";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  // const router = useRouter();

  // useEffect(() => {
  //   if (status === "authenticated" && session?.user?.name) {
  //     router.replace(`/p/${session.user.name}`);
  //   }
  // }, [router, status, session?.user?.name]);

  return (
    <>
      <Head>
        <title>Playdex Score</title>
        <meta name="description" content="Your Web 3.0 Gaming Score" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative flex h-screen items-center justify-center overflow-hidden">
        <img src="/bg.svg" alt="" className="pointer-events-none absolute" />
        <div
          className={cn(
            "flex w-auto flex-col items-center justify-center rounded-xl p-10",
            "border border-solid border-[#3E355F] bg-[rgba(23,20,36,.33)]"
          )}
        >
          <PlaydexLogo />
          <h1 className="mt-8 text-2xl">Find out your Web 3.0 gaming score</h1>
          <div className="mt-6">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
