import { Box, Container, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { FooterBar } from "@fantohm/shared-ui-themes";
import style from "./footer.module.scss";
import { discordIcon, instagramIcon, twitterIcon } from "@fantohm/shared/images";

type Page = {
  title: string;
  href: string;
};

export const Footer = (): JSX.Element => {
  const footerItems: Page[] = [
    {
      title: "Help",
      href: "/help",
    },
    {
      title: "Terms",
      href: "/term",
    },
    {
      title: "Privacy",
      href: "/privacy",
    },
  ];

  return (
    <FooterBar
      elevation={0}
      position="sticky"
      style={{ marginTop: "auto", zIndex: "0" }}
      className={style["footerBar"]}
    >
      <Container maxWidth="xl" sx={{ my: "2em" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", md: "500px" },
              justifyContent: "space-between",
            }}
          >
            {footerItems.map((footerItem: Page, index: number) => {
              return (
                <Link to={footerItem.href} key={`footer-link-${index}`}>
                  {footerItem.title}
                </Link>
              );
            })}
          </Box>
          <Box sx={{ mt: { xs: "20px", md: "0", display: "flex" } }}>
            <Typography textAlign="center" variant="body2" color="white">
              Copyright &copy; 2022. All rights reserved.
            </Typography>
            <a href="https://discord.gg/balanceco" target="_blank" rel="noreferrer">
              <img src={discordIcon} alt="discordIcon" className={style["socialDiv"]} />
            </a>
            <a href="https://twitter.com/liqdnft" target="_blank" rel="noreferrer">
              <img src={twitterIcon} alt="twitterIcon" className={style["socialDiv"]} />
            </a>
            <a href=" https://instagram.com/liqdnft" target="_blank" rel="noreferrer">
              <img
                src={instagramIcon}
                alt="instagramIcon"
                className={style["socialDiv"]}
              />
            </a>
          </Box>
        </Toolbar>
      </Container>
    </FooterBar>
  );
};
