import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { NftCard, Layout, Inventory } from "../../components";
import { tokenContracts } from "../../server/constants";
import type { NFTMetadata } from "../../types";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const { wallet } = router.query;

  const profile = trpc.score.getProfile.useQuery(wallet as string, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

  const renderProfile = () => {
    if (!profile.data) {
      return <div>Loading...</div>;
    }

    if (!profile.data.score) {
      return (
        <div className="mx-auto max-w-[400px] px-8">
          <Image src="/empty-state.svg" alt="" width="377" height="236" />
          <h1 className="text-lg font-medium">
            Oops... We can’t find any activity on this wallet
          </h1>

          <p className="mt-3 text-sm text-[#989DB3]">
            For now count ownership and transfer of NFTs in&nbsp;these Web 3.0
            games:
          </p>
          <ul className="mt-2 text-sm text-[#989DB3]">
            {Object.values(tokenContracts).map((contract) => (
              <li key={contract.address}>- {contract.name}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#232430]">
            <Image src="/points.svg" alt="" width="24" height="24" />
          </div>
          <h2>
            <span className="text-[36px]">{profile.data?.score}</span>{" "}
            <span className="text-sm text-[#989DB3]">points</span>
          </h2>
        </div>

        <div className="gap-20 md:mt-6 md:flex">
          {profile.data.actions.length > 0 && (
            <div className="flex-1">
              <h2 className="mt-8 text-xl font-medium md:mt-0">Actions</h2>

              <div className="mt-4 flex w-full flex-col gap-4">
                {profile.data.actions.map((action, i) => {
                  const metadata = action.tokenMetadata as unknown as
                    | NFTMetadata
                    | undefined;

                  return (
                    <div
                      className="flex items-center justify-between gap-2"
                      key={i}
                    >
                      <div className="flex items-center gap-3">
                        {metadata?.image && (
                          <div className="aspect-square h-10 w-10 overflow-hidden rounded-lg bg-[#1D1C2D]">
                            <img
                              src={metadata.image}
                              alt={metadata.name}
                              className=""
                            />
                          </div>
                        )}
                        <div>
                          <div>{action.title}</div>
                          <div className="text-sm text-[#989DB3]">
                            {
                              {
                                nft_transfer: "Transfer",
                                nft_ownership: "Ownership",
                              }[action.type]
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-[#33FFB6]">+{action.score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(profile.data.ownedTokens).length > 0 && (
            <Inventory ownedTokens={profile.data.ownedTokens} />
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Playdex Score</title>
        <meta name="description" content="Your Web 3.0 gaming score" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {renderProfile()}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const notFound = typeof params?.wallet !== "string";

  return {
    notFound,
    props: {},
  };
};

export default ProfilePage;
