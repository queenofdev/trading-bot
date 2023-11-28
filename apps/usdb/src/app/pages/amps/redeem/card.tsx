import {
  Box,
  Grid,
  Button,
  Paper,
  OutlinedInput,
  InputAdornment,
  Typography,
  Icon,
  useMediaQuery,
  Divider,
  ThemeProvider,
} from "@mui/material";
import { USDBLight } from "@fantohm/shared-ui-themes";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "react-circular-progressbar/dist/styles.css";

import style from "../amps.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  allBonds,
  BondType,
  IAllBondData,
  isPendingTxn,
  txnButtonText,
} from "@fantohm/shared-web3";
import { useMemo } from "react";

const percentage = 66;

export default function RedeemCard(props: any) {
  const { use, title, image, cost, description, method, stakedType } = props;

  const pendingTransactions = useSelector((state: RootState) => {
    return state?.pendingTransactions;
  });

  const bondData = useMemo(() => {
    return allBonds.filter(
      (pool) => pool.type === BondType.STAKE_NFT && pool.days === stakedType
    )[0] as IAllBondData;
  }, [stakedType]);

  const onRedeem = () => {
    if (!props.onRedeem) return;
    props.onRedeem();
  };

  return (
    <Grid xs={3}>
      <ThemeProvider theme={USDBLight}>
        <Box className={`${style["redeemCard"]} flexCenterCol`}>
          <Box className={style["header"]}>
            <div className={`${style["textWrapper"]}`}>
              {use ? "Multiple use" : "Single use"}
            </div>
            <Typography
              variant="subtitle1"
              color="primary"
              textAlign="center"
              paddingTop={3}
              paddingBottom={2}
              fontWeight="bold"
            >
              {title}
            </Typography>
          </Box>

          <Grid container>
            <Grid item xs={12} className={style["imageBox"]}>
              <img src={image} className={style["image"]} />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="primary"
                className={style["description"]}
              >
                Cost
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary"
                marginBottom={1}
                className={style["cost"]}
              >
                {cost === -1 ? "Highest Holder" : `${cost} AMPS`}
              </Typography>
              <Box className={style["descBox"]}>
                <div>
                  <Icon>
                    <InfoOutlinedIcon />
                  </Icon>
                  <Typography
                    variant="body2"
                    color="primary"
                    className={style["description"]}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              </Box>
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
              <Button
                variant="contained"
                color="primary"
                id="bond-btn"
                className="paperButton transaction-button"
                disabled={
                  stakedType === -1 ||
                  isPendingTxn(
                    pendingTransactions,
                    "redeem_" + method + (bondData && bondData.name)
                  )
                }
                onClick={() => onRedeem()}
              >
                {txnButtonText(
                  pendingTransactions,
                  "redeem_" + method + (bondData && bondData.name),
                  "Redeem"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </Grid>
  );
}
