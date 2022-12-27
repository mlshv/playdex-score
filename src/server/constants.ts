import { EvmChain } from "@moralisweb3/common-evm-utils";

export const SCORES = {
  NFT_TRANSFER: 10,
  NFT_OWNERSHIP: 100,
};

export const tokenContracts: Record<
  string,
  {
    chain: EvmChain;
    address: string;
    name: string;
    scoreForTransfer: number;
    scoreForOwnership: number;
  }
> = {
  "0x4ad7d646dc0b25f3048d18355bc1df338facf59d": {
    chain: EvmChain.BSC,
    address: "0x4ad7d646dc0b25f3048d18355bc1df338facf59d",
    name: "Anito Legends NFT",
    scoreForTransfer: SCORES.NFT_TRANSFER,
    scoreForOwnership: SCORES.NFT_OWNERSHIP,
  },
};
