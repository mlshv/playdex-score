import type { EvmNft } from "@moralisweb3/common-evm-utils";
import { useQuery } from "@tanstack/react-query";
import type { NFTMetadata } from "../types";

export const NftCard = ({
  tokenUri,
  metadata: metadataProp,
}: {
  tokenUri: EvmNft["tokenUri"];
  metadata: EvmNft["metadata"];
}) => {
  const { data } = useQuery({
    queryKey: ["nft", tokenUri],
    queryFn: () => fetch(tokenUri!).then((result) => result.json()),
    enabled: !metadataProp || !tokenUri,
  });

  const metadata: NFTMetadata = data ?? metadataProp;

  if (!metadata) {
    return (
      <div className="flex aspect-square w-full rounded-lg bg-[#1D1C2D]" />
    );
  }

  return (
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#1D1C2D]">
      <img
        src={metadata.image}
        alt={metadata.name}
        className="block max-h-full max-w-full"
      />
    </div>
  );
};
