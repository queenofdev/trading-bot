import { JsonRpcProvider } from "@ethersproject/providers";

/**
 * determine if in IFrame for Ledger Live
 */
export const isIframe = () => {
  return window.location !== window.parent.location;
};

export const sign = async (provider: JsonRpcProvider) => {
  return await provider.getSigner().signMessage("message");
};

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const objectToQueryParams = (o: any) =>
  Object.entries(o)
    .map((p: any) => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`)
    .join("&");

export const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content).then(
    function () {
      //console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const scrollTo = (position: number) => {
  window.scrollTo({ top: position, behavior: "smooth" });
};
