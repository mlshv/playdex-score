import { type NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { trpc } from "../utils/trpc";
import { Layout } from "../components";
import { useSession } from "next-auth/react";

const getAnitoNfts = async (address: string) => {
  const anitoAddress = "0x4aD7D646Dc0b25f3048d18355bC1dF338FaCF59D";

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain: EvmChain.BSC,
    tokenAddresses: [anitoAddress],
  });

  return response;
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  useQuery({
    queryKey: ["anito-balance"],
    queryFn: () => getAnitoNfts(session!.user!.name),
    enabled: Boolean(session?.user?.name),
  });

  return (
    <Layout>
      <Head>
        <title>Atlas</title>
        <meta name="description" content="Your web3 gaming score" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div></div>
    </Layout>
  );
};

export default Home;
