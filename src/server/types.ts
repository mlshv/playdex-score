import type { EvmChain } from "@moralisweb3/common-evm-utils";

export type ScoreAction = {
  type: "nft_transfer" | "nft_ownership";
  chain: EvmChain;
  title: string;
  score: number;
  datetime: Date;
};
