import type { EvmNft, EvmNftMetadata } from "@moralisweb3/common-evm-utils";
import Image from "next/image";

type NFTMetadata = EvmNftMetadata & {
  image?: string;
  name?: string;
};

export const InventoryItem = ({ token }: { token: EvmNft }) => {
  const metadata = token?.metadata as unknown as NFTMetadata;

  return (
    <div>
      {metadata?.image && (
        <Image
          src={metadata.image}
          alt={metadata?.name}
          width="150"
          height="150"
        />
      )}
      <div>{metadata?.name}</div>
    </div>
  );
};
