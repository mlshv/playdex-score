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
    name: "Anito Legends",
    scoreForTransfer: SCORES.NFT_TRANSFER,
    scoreForOwnership: SCORES.NFT_OWNERSHIP,
  },
  "0x19f870bd94a34b3adaa9caa439d333da18d6812a": {
    chain: EvmChain.POLYGON,
    address: "0x19f870bd94a34b3adaa9caa439d333da18d6812a",
    name: "Gotchiverse",
    scoreForTransfer: SCORES.NFT_TRANSFER,
    scoreForOwnership: SCORES.NFT_OWNERSHIP,
  },
  "0x98eb46cbf76b19824105dfbcfa80ea8ed020c6f4": {
    chain: EvmChain.BSC,
    address: "0x98eb46cbf76b19824105dfbcfa80ea8ed020c6f4",
    name: "Thetan Arena",
    scoreForTransfer: SCORES.NFT_TRANSFER,
    scoreForOwnership: SCORES.NFT_OWNERSHIP,
  },
  "0x04b0f7d5cb2ce4688497f2525748fb7a9affa394": {
    chain: EvmChain.BSC,
    address: "0x04b0f7d5cb2ce4688497f2525748fb7a9affa394",
    name: "Kryptomon",
    scoreForTransfer: SCORES.NFT_TRANSFER,
    scoreForOwnership: SCORES.NFT_OWNERSHIP,
  },
};
