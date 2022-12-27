import { type AppType } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

import "../styles/globals.css";
import { clientEnv } from "../env/schema.mjs";
import { trpc } from "../utils/trpc";
import { initMoralis } from "../utils/initMoralis";

initMoralis();

const wagmiClient = createClient(
  getDefaultClient({
    appName: "Atlas",
    alchemyId: clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY,
  })
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={session} refetchInterval={0}>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
