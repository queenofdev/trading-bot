import { Box, Fade, SvgIcon, Typography, Modal } from "@mui/material";
import { formatAmount } from "@fantohm/shared-helpers";
import { memo } from "react";

import style from "./xfhm-lqdr.module.scss";
import { AssetToken } from "@fantohm/shared-web3";

export const AssetTokenModal = (props: any): JSX.Element => {
  return (
    <Modal open={props.open} onClose={() => props.onClose(null)}>
      <Fade in={props.open}>
        <Box className={style["asset-token-modal"]} padding="20px">
          <Box mb="20px">
            <Typography variant="h6">Select Asset Token</Typography>
          </Box>
          {props?.assetTokens.map((token: AssetToken, index: number) => {
            return (
              index !== 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  className="cursor-pointer"
                  width="100%"
                  alignItems="center"
                  mb="20px"
                  key={`${index}-${token.name}`}
                  onClick={() => props.onClose(token)}
                >
                  <Box display="flex" alignItems="center" mr="20px">
                    <SvgIcon viewBox="0 0 32 32" component={token?.iconSvg} />
                  </Box>
                  <Typography variant="h5" mr="20px">
                    {token.name}
                  </Typography>
                  <Typography noWrap className="w100" variant="h5">
                    {formatAmount(
                      token.balance ? token.balance : 0,
                      token.decimals,
                      9,
                      true
                    )}
                  </Typography>
                </Box>
              )
            );
          })}
        </Box>
      </Fade>
    </Modal>
  );
};

export default memo(AssetTokenModal);
