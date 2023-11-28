import { Box, Grid, Typography } from "@mui/material";
import style from "./partners-grid.module.scss";
import {
  HackenIcon,
  SpadetechIcon,
  TechrateIcon,
  HackenIconDark,
  SpadetechIconDark,
  TechrateIconDark,
} from "@fantohm/shared/images";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect, useState } from "react";
import { USDBDark, USDBLight } from "@fantohm/shared-ui-themes";

export const AuditGrid = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  const [theme, setTheme] = useState(USDBDark);

  useEffect(() => {
    setTheme(themeType === "light" ? USDBLight : USDBDark);
  }, [themeType]);
  return (
    <Box
      style={{ alignContent: "center", justifyContent: "center", marginTop: "150px" }}
      className={style["productGrid"]}
    >
      <Grid
        container
        rowSpacing={6}
        style={{
          width: "80%",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "10%",
          marginBottom: "50px",
        }}
        className={style["productGrid"]}
      >
        <Grid item md={12} xs={12}>
          <Typography
            style={{
              textAlign: "center",
              fontSize: "36px",
              fontWeight: "400",
            }}
            className="auditTitle"
          >
            Empowered & Audited As Necessary
          </Typography>{" "}
        </Grid>
        <Grid item md={4} sm={4} className={style["auditElem"]}>
          <a
            href={
              "https://github.com/fantohm-dev/fantohm-contracts/blob/main/audit/Fantohm%20USD%20Full%20Smart%20Contract%20Security%20Audit.pdf"
            }
          >
            <img
              src={theme === USDBLight ? TechrateIcon : TechrateIconDark}
              alt="USDB logo"
              className={style["auditIcon"]}
            />
          </a>
        </Grid>
        <Grid item md={4} sm={4} className={style["auditElem"]}>
          <a href="https://github.com/fantohm-dev/fantohm-contracts/blob/main/audit/FantOHM-66_staking-Hacken-Feb_2022.pdf">
            <img
              src={theme === USDBLight ? HackenIcon : HackenIconDark}
              alt="USDB logo"
              className={style["auditIcon"]}
            />
          </a>
        </Grid>
        <Grid item md={4} sm={4} className={style["auditElem"]}>
          <a href="https://github.com/fantohm-dev/fantohm-contracts/blob/main/audit/FantOHM_DAO_Spadetech.io_Audit_Nov_2021.pdf">
            <img
              src={theme === USDBLight ? SpadetechIcon : SpadetechIconDark}
              alt="USDB logo"
              className={style["auditIcon"]}
            />
          </a>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuditGrid;
