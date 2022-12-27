import Moralis from "moralis";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clientEnv } from "../env/schema.mjs";

const MoralisContext = createContext({ isStarted: false });

const moralisStartPromise = Moralis.start({
  apiKey: clientEnv.NEXT_PUBLIC_MORALIS_API_KEY,
});

export const MoralisInitProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    moralisStartPromise.then(() => setIsStarted(true));
  }, []);

  const contextValue = useMemo(() => ({ isStarted }), [isStarted]);

  return (
    <MoralisContext.Provider value={contextValue}>
      {children}
    </MoralisContext.Provider>
  );
};

export const useMoralisInit = () => {
  return useContext(MoralisContext);
};
