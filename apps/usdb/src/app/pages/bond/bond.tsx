import { Backdrop, Fade, FormControl, Grid, Paper, RadioGroup } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import BondDeposit from "./bond-deposit/bond-deposit";
import BondRedeem from "./bond-redeem/bond-redeem";
import style from "./bond.module.scss";
import { Box } from "@mui/material";
import { BondRadioButton } from "./bond-radio-button/bond-radio-button";

export const Bond = (): JSX.Element => {
  const { bondType } = useParams();
  const [isDeposit, setIsDeposit] = useState(true);

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view" className={style["bondView"]}>
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className={`${style["flexCenterCol"]} ${style["paperContainer"]}`}>
              <h2>{bondType}</h2>
              <Grid container sx={{ maxWidth: "500px" }}>
                <Grid item xs={12}>
                  <Box className={style["flexCenterRow"]}>
                    <FormControl>
                      <RadioGroup row name="bond-options" defaultValue="deposit">
                        <BondRadioButton
                          onClick={() => setIsDeposit(true)}
                          active={isDeposit}
                          label="Deposit"
                        />
                        <BondRadioButton
                          onClick={() => setIsDeposit(false)}
                          active={!isDeposit}
                          label="Redeem"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box className={style["flexCenterRow"]}>
                    {isDeposit ? (
                      <BondDeposit bondType={bondType} />
                    ) : (
                      <BondRedeem bondType={bondType} />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
};

export default Bond;
