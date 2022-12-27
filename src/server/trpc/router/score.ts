import { z } from "zod";
import Moralis from "moralis";
import type { GetWalletNFTsResponseAdapter } from "@moralisweb3/common-evm-utils";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { uniqBy } from "ramda";

import { router, publicProcedure } from "../trpc";
import { isScorableNFT } from "../../utils";
import type { ScoreAction } from "../../types";
import { tokenContracts } from "../../constants";

// for all chains:
// get wallet NFTs
// get NFTs transfers
// create array of scores from transfers:
// - add time of tranfser
// - add scoreForOwnership if owned
// - add scoreForTransfer if not owned currently, but was owned previously
// merge all chians into one array
// sort array by transfer transaction timestamp
const getNftScore = async (wallet: string) => {
  const chains = [EvmChain.BSC, EvmChain.POLYGON];

  let score = 0;
  const scoreActions = [] as ScoreAction[];
  const ownedTokens = [];

  for (const chain of chains) {
    const nftTransfersResponse = await Moralis.EvmApi.nft.getWalletNFTTransfers(
      {
        address: wallet,
        chain,
      }
    );

    const uniqTokenTransfers = uniqBy(
      (tx) => `${tx.tokenAddress.format()}-${tx.tokenId}`,
      nftTransfersResponse.result
    );

    const ownedNFTs = (
      await Moralis.EvmApi.nft.getWalletNFTs({
        address: wallet,
        chain,
      })
    ).result.filter((token) => isScorableNFT(token.tokenAddress));

    ownedTokens.push(...Object.values(ownedNFTs));

    const ownedNFTsMap = ownedNFTs.reduce((result, token) => {
      return {
        ...result,
        [`${token.tokenAddress}-${token.tokenId}`]: token,
      };
    }, {} as Record<string, GetWalletNFTsResponseAdapter["result"][number]>);

    uniqTokenTransfers
      .filter((tx) => isScorableNFT(tx.tokenAddress))
      .forEach((tx) => {
        const contract =
          tokenContracts[tx.tokenAddress.format().toLocaleLowerCase()];

        if (ownedNFTsMap[`${tx.tokenAddress}-${tx.tokenId}`]) {
          score += contract!.scoreForOwnership;
          scoreActions.push({
            type: "nft_ownership",
            title: contract!.name,
            score: contract!.scoreForOwnership,
            datetime: tx.blockTimestamp,
            chain,
          });

          return;
        }

        score += contract!.scoreForTransfer;
        scoreActions.push({
          type: "nft_transfer",
          title: contract!.name,
          score: contract!.scoreForTransfer,
          datetime: tx.blockTimestamp,
          chain,
        });
      });
  }

  return {
    score,
    actions: [...scoreActions].sort((a, b) => {
      return b.datetime.getTime() - a.datetime.getTime(); // later => higher
    }),
    ownedTokens,
  };
};

export const scoreRouter = router({
  getProfile: publicProcedure
    .input(z.string())
    .query(async ({ input: wallet }) => {
      const { score, actions, ownedTokens } = await getNftScore(wallet);

      return {
        wallet,
        score,
        actions,
        ownedTokens,
      };
    }),
});
