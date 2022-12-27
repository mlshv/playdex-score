import Moralis from "moralis";

let isInited = false;

export async function initMoralis() {
  if (typeof window !== "undefined") {
    return;
  }

  if (!isInited) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });

    isInited = true;
  }
}
