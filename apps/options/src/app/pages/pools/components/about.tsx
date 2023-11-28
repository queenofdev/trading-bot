import { IconButton } from "@mui/material";
import { ContentCopy, Launch, CallMade } from "@mui/icons-material";
import { useWeb3Context, networks } from "@fantohm/shared-web3";
import { addressEllipsis } from "@fantohm/shared-helpers";

import { LabelIcon } from "../../../components/label-icon/label-icon";

export const About = (): JSX.Element => {
  const { chainId } = useWeb3Context();
  const contractAddress = "0x50664edE715e131F584D3E7EaAbd7818Bb20A068";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const handleExplorer = () => {
    if (!chainId) return;
    else window.open(networks[chainId].getEtherscanAddress(contractAddress), "_blank");
  };

  return (
    <div className="text-primary md:rounded-3xl border-bunker border-2 xs:hidden sm:block">
      <div className="flex justify-between items-center border-b-2 border-bunker  xs:px-10 xl:px-40 py-30">
        <p className="text-30">About</p>
      </div>
      <div className="xs:px-10 xl:px-40 py-30">
        <div className="description">
          <p className="text-20">Description</p>
          <p className="text-16 mt-30">
            Depositing funds into this pool carries some risk. Rewards may increase
            consistently, although your deposit on the other hand may decrease or
            increase. You can lose a significant portion of your investment if traders are
            making large profits, understand that there are no reimbursements when this
            happens. <br />
            <br />
            You are essentially acting as a market maker by staking in the pool.
            Specifically the LP will increase in value when traders unsuccessfully predict
            the market’s direction, and it will decrease in value when traders
            successfully predict the direction.
            <br />
            <br />
            The LP will also increase in value from trading fees and funds are locked
            within the pool for 24 hours.
          </p>
        </div>
        <div className="contract-address mt-50">
          <p className="text-20">Contract address</p>
          <div className="bg-woodsmoke py-5 px-15 flex justify-between items-center rounded-xl mt-30">
            <p className="xs:hidden sm:block text-regentgray">{contractAddress}</p>
            <p className="xs:block sm:hidden text-regentgray">
              {addressEllipsis(contractAddress)}
            </p>
            <div>
              <IconButton
                size="small"
                aria-label="copy address"
                sx={{
                  width: 40,
                  height: 40,
                }}
                className={"text-primary"}
                onClick={copyToClipboard}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="copy address"
                sx={{
                  width: 40,
                  height: 40,
                }}
                className={"text-primary"}
                onClick={() => {
                  handleExplorer();
                }}
              >
                <Launch fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="external-links mt-50">
          <p className="text-20">External links</p>
          <div className="bg-woodsmoke py-10 px-15 flex justify-between items-center rounded-xl mt-30 w-175">
            <LabelIcon
              label="Documentation"
              icon={CallMade}
              labelColor="regentgray"
              backgroundColor="woodsmoke"
              iconColor="regentgray"
              iconFontSize={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
