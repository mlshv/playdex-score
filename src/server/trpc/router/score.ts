import { z } from "zod";
import Moralis from "moralis";
import type { GetWalletNFTsResponseAdapter } from "@moralisweb3/common-evm-utils";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { groupBy, uniqBy } from "ramda";
import fetch from "node-fetch";

import { router, publicProcedure } from "../trpc";
import { isScorableNFT } from "../../utils";
import type { ScoreAction } from "../../../types";
import { tokenContracts } from "../../constants";

// get wallet NFTs
// get NFTs transfers
// create array of scores from transfers:
// - add time of tranfser
// - add scoreForOwnership if owned
// - add scoreForTransfer if not owned currently, but was owned previously
// merge all chians into one array
const getNftScoreForChain = async (wallet: string, chain: EvmChain) => {
  let score = 0;
  const scoreActions = [] as ScoreAction[];
  const ownedTokens = [];

  const [walletNfts, walletNftTransfers] = await Promise.all([
    Moralis.EvmApi.nft.getWalletNFTs({
      address: wallet,
      chain,
    }),
    Moralis.EvmApi.nft.getWalletNFTTransfers({
      address: wallet,
      chain,
    }),
  ]);

  const uniqTokenTransfers = uniqBy(
    (tx) => `${tx.tokenAddress.format()}-${tx.tokenId}`,
    walletNftTransfers.result
  );

  const ownedNFTs = walletNfts.result.filter((token) =>
    isScorableNFT(token.tokenAddress)
  );

  ownedTokens.push(...ownedNFTs);

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
      const ownedNFT = ownedNFTsMap[`${tx.tokenAddress}-${tx.tokenId}`];

      if (ownedNFT) {
        score += contract!.scoreForOwnership;
        scoreActions.push({
          type: "nft_ownership",
          title: contract!.name,
          score: contract!.scoreForOwnership,
          datetime: tx.blockTimestamp,
          tokenId: tx.tokenId,
          tokenAddress: tx.tokenAddress,
          tokenMetadata: ownedNFT.metadata,
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
        tokenAddress: tx.tokenAddress,
        tokenId: tx.tokenId,
        chain,
      });
    });

  await Promise.all(
    scoreActions.map(async (action, i) => {
      if (action.tokenMetadata) {
        return;
      }

      const metadata = await Moralis.EvmApi.nft.getNFTMetadata({
        address: action.tokenAddress,
        tokenId: action.tokenId,
        chain,
      });

      if (metadata?.result.tokenUri) {
        scoreActions[i]!.tokenMetadata = (await fetch(
          metadata?.result.tokenUri
        ).then((r) => r.json())) as any;
      }
    })
  );

  return { score, scoreActions, ownedTokens };
};

// for all chains:
// get score, actions, owned nfts
// sort array by transfer transaction timestamp
const getNftScore = async (wallet: string) => {
  const [bsc, polygon] = await Promise.all([
    getNftScoreForChain(wallet, EvmChain.BSC),
    getNftScoreForChain(wallet, EvmChain.POLYGON),
  ]);

  return {
    score: bsc.score + polygon.score,
    actions: [...bsc.scoreActions, ...polygon.scoreActions].sort((a, b) => {
      return b.datetime.getTime() - a.datetime.getTime(); // later => higher
    }),
    ownedTokens: groupBy(
      (token) => {
        const contract =
          tokenContracts[token.tokenAddress.format().toLocaleLowerCase()];

        return contract!.name;
      },
      [...bsc.ownedTokens, ...polygon.ownedTokens]
    ),
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
