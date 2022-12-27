import type { EvmAddress } from "@moralisweb3/common-evm-utils";
import { tokenContracts } from "../constants";

export const isScorableNFT = (tokenAddress: EvmAddress) =>
  Boolean(tokenContracts[tokenAddress.format().toLocaleLowerCase()]);
