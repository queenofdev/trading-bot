import { JsonRpcProvider } from "@ethersproject/providers";

export const waitUntilBlock = (provider: JsonRpcProvider, targetBlockNumber: number) =>
  new Promise<void>((resolve, _) => {
    const listener = (blockNumber: number) => {
      if (blockNumber >= targetBlockNumber) {
        resolve();
        provider.removeListener("block", listener);
      }
    };
    provider.on("block", listener);
  });
