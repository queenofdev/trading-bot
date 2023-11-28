import { Box, Typography } from "@mui/material";
import { NftPrice, NftPriceProvider } from "../../../types/backend-types";
import NabuLogoImage from "../../../../assets/images/nabu-logo.png";
import UpshotLogoImage from "../../../../assets/images/upshot-logo.png";
import NftBankLogoImage from "../../../../assets/images/nftbank-logo.png";
import InfoImage from "../../../../assets/images/info.png";

export interface PriceInfoProps {
  prices: NftPrice[];
}

export const PriceInfo = ({ prices }: PriceInfoProps): JSX.Element => {
  const getPriceProvider = (priceProvider: NftPriceProvider) => {
    switch (priceProvider) {
      case NftPriceProvider.Nabu:
        return "Nabu";
      case NftPriceProvider.Upshot:
        return "Upshot";
      case NftPriceProvider.NftBank:
        return "NFT Bank";
    }
  };

  const getPriceProviderLogo = (priceProvider: NftPriceProvider) => {
    switch (priceProvider) {
      case NftPriceProvider.Nabu:
        return NabuLogoImage;
      case NftPriceProvider.Upshot:
        return UpshotLogoImage;
      case NftPriceProvider.NftBank:
        return NftBankLogoImage;
    }
  };

  const getPriceProviderDiv = (price: NftPrice) => {
    return (
      <Box
        key={price.priceProvider}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <img
          src={getPriceProviderLogo(price.priceProvider)}
          alt={price.priceProvider + " Logo"}
          style={{ height: "fit-content", margin: "5px", marginTop: "-20px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            style={{
              fontSize: "16px",
              color: "#8991a2",
            }}
          >
            {getPriceProvider(price.priceProvider)} Valuation
          </Typography>
          <Typography
            style={{
              fontSize: "20px",
            }}
          >
            {parseFloat(price.priceInEth).toFixed(2)} ETH
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        gridColumnGap: "24px",
        gridRowGap: "24px",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {getPriceProviderDiv(prices[0])}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <img
          src={InfoImage}
          alt="Info"
          style={{ height: "fit-content", marginTop: "2px", marginLeft: "5px" }}
        />
        <Typography
          style={{
            fontSize: "12px",
            color: "#8991a2",
            marginLeft: "10px",
          }}
        >
          Data provided is for informational purposes only
        </Typography>
      </Box>
      {prices.slice(1).map((price) => getPriceProviderDiv(price))}
    </Box>
  );
};

export default PriceInfo;
