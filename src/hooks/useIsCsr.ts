import { useEffect, useState } from "react";

export function useIsCsr() {
  const [isCsr, setIsCsr] = useState(false);

  useEffect(() => {
    setIsCsr(
      Boolean(
        typeof window !== "undefined" &&
          window.document &&
          window.document.documentElement
      )
    );
  }, []);

  return isCsr;
}
