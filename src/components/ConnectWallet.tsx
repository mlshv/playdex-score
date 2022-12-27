import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSigner, useSignMessage } from "wagmi";
import { useEffect } from "react";
import { ConnectKitButton } from "connectkit";

export function ConnectWallet() {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { data: signer } = useSigner();

  const handleLogin = async () => {
    try {
      const nonce = await getCsrfToken();

      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  useEffect(() => {
    if (isConnected && status == "unauthenticated" && signer) {
      handleLogin();
    }
  }, [signer, isConnected]);

  return <ConnectKitButton />;
}
