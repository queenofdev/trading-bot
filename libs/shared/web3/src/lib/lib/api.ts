import axios from "axios";

export const BACKED_NFT_API_URL = "https://liqdnft.usdbalance.com";

export const getNftImageUri = async (tokenId: number): Promise<string> => {
  const url = `${BACKED_NFT_API_URL}/image/${tokenId}`;
  return url;

  // return await axios.get(url).then((resp: any) => {
  //   return resp.data;
  // });
};

export const mintBackedNft = async (tokenId: number): Promise<string> => {
  const url = `${BACKED_NFT_API_URL}/mint/${tokenId}`;

  return await axios.get(url).then((resp: any) => {
    console.log("AAAAAAAAAAA", "SUCCESS");
    return resp.data;
  });
};
