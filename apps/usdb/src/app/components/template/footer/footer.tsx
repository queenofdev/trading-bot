import { AppBar, Box, Container, Grid, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { Logo } from "../../logo/logo";
import MenuLink from "../header/menu-link";
import { FooterItem, footerItems, Page } from "../../../constants/nav";
import style from "./footer.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export const Footer = (): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.app.theme);
  return (
    <AppBar position="static" color="transparent" elevation={0} style={{ margin: 0 }}>
      <Container maxWidth="xl" sx={{ my: { xs: "30px", sm: "100px" } }}>
        <Toolbar disableGutters>
          <Grid container spacing={2} sx={{ px: { xs: "40px", md: "0" } }}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box width="300px" mb="30px">
                  <Link to="/">
                    <Logo />
                  </Link>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    className="font-weight-bold"
                    style={{ marginTop: "15px" }}
                  >
                    Our organization includes financial engineers and developers with top
                    level mastery within the fields of risk management and software
                    engineering.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {footerItems.map((item: FooterItem, index: number) => (
                  <Grid item xs={6} sm={6} md={4} key={`footer-item-${index}`}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        className="font-weight-bolder"
                        style={{ marginBottom: "20px" }}
                      >
                        {item.label}
                      </Typography>
                      {item.pages.map((page: Page) => (
                        <MenuLink
                          href={page?.params?.comingSoon ? "#" : page.href}
                          key={page.title}
                          style={{ marginBottom: "10px" }}
                        >
                          <Typography
                            color="textPrimary"
                            style={{ opacity: page?.params?.comingSoon ? 0.2 : 1 }}
                          >
                            {page.title}
                          </Typography>
                        </MenuLink>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
      <Box className={style["splitter"]} />
      <Box
        sx={{
          background: "black",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          py: "10px",
        }}
      >
        <Typography color="white" textAlign="center">
          &copy; 2022 USD Balance
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              mx: { xs: "0", sm: "30px" },
              mt: "3px",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Typography color="white">*</Typography>
          </Box>
          <Typography color="white" textAlign="center">
            <a href="mailto:hello@usdbalance.com" style={{ color: "white" }}>
              info@usdbalance.com
            </a>
          </Typography>
          <Box
            sx={{
              mx: { xs: "0", sm: "30px" },
              mt: "3px",
              display: { xs: "none", sm: "block" },
            }}
          ></Box>
        </Box>
      </Box>
    </AppBar>
  );
};
