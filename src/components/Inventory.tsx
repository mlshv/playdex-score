import type { EvmNft } from "@moralisweb3/common-evm-utils";
import { useState } from "react";
import cn from "classnames";
import { NftCard } from "./NftCard";

export const Inventory = ({
  ownedTokens,
}: {
  ownedTokens: Record<string, EvmNft[]>;
}) => {
  const [activeGame, setActiveGame] = useState(Object.keys(ownedTokens)[0]);

  return (
    <div className="flex-1">
      <h2 className="mt-8 text-xl font-medium md:mt-0">Game NFTs</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.keys(ownedTokens).map((gameName) => (
          <button
            key={gameName}
            className={cn(
              "rounded-[42px] border border-solid border-[#2A2C3C] bg-[#232430] px-3 py-[6px] text-[#989DB3]",
              activeGame === gameName && "border-[#3F425A] text-white"
            )}
            onClick={() => setActiveGame(gameName)}
          >
            {gameName}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        {activeGame &&
          ownedTokens[activeGame]?.map((token, i) => (
            <NftCard
              tokenUri={token.tokenUri}
              metadata={token.metadata}
              key={i}
            />
          ))}
      </div>
    </div>
  );
};
