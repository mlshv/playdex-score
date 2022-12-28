import { type AppType } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient, SIWEProvider } from "connectkit";
import type { SIWEConfig } from "connectkit/build/components/Standard/SIWE/SIWEContext";
import {
  getCsrfToken,
  SessionProvider,
  signIn,
  signOut,
  getSession,
} from "next-auth/react";
import type { Session } from "next-auth";
import * as chains from "wagmi/chains";
import { SiweMessage } from "siwe";

import "../styles/globals.css";
import { clientEnv } from "../env/schema.mjs";
import { trpc } from "../utils/trpc";
import { initMoralis } from "../utils/initMoralis";

initMoralis();

const wagmiClient = createClient(
  getDefaultClient({
    appName: "Playdex Score",
    alchemyId: clientEnv.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: Object.values(chains),
  })
);

const siweConfig: SIWEConfig = {
  getNonce: async () => (await getCsrfToken()) ?? "",
  createMessage: ({ nonce, address, chainId }) =>
    new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    }).prepareMessage(),
  verifyMessage: async ({ message, signature }) => {
    await signIn("credentials", {
      message: JSON.stringify(message),
      redirect: false,
      signature,
    });

    return true;
  },
  getSession: async () => {
    const session = await getSession();

    const address = session?.address;

    if (!session || !address) {
      return null;
    }

    return { ...session, address, chainId: chains.mainnet.id };
  },
  signOut: async () => {
    await signOut();

    return true;
  },
  signOutOnNetworkChange: false,
  signOutOnAccountChange: false,
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={session} refetchInterval={0}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider
            customTheme={{
              "--ck-connectbutton-background": "#232430",
              "--ck-connectbutton-border-radius": "42px",
              "--ck-connectbutton-box-shadow": "0 0 0 1px #3F425A",
              "--ck-connectbutton-hover-background": "#3E355F",
              "--ck-connectbutton-active-background": "#3E355F",
            }}
          >
            <Component {...pageProps} />
          </ConnectKitProvider>
        </SIWEProvider>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
