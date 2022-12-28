import type {
  EvmAddress,
  EvmChain,
  EvmNft,
  EvmNftMetadata,
} from "@moralisweb3/common-evm-utils";

export type NFTMetadata = EvmNftMetadata & {
  image?: string;
  name?: string;
};

export type ScoreAction = {
  type: "nft_transfer" | "nft_ownership";
  chain: EvmChain;
  title: string;
  score: number;
  tokenAddress: EvmAddress;
  tokenId: string;
  tokenMetadata?: EvmNft["metadata"];
  datetime: Date;
};
