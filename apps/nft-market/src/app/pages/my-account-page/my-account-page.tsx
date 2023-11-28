//import style from "./my-account-page.module.scss";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import { useImpersonateAccount } from "@fantohm/shared-web3";
import { RootState } from "../../store";
import { AccountProfile } from "./account-profile/account-profile";
import { useMemo } from "react";
import { useLocation, useParams, Outlet, Link } from "react-router-dom";
import style from "./my-account-page.module.scss";

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type TabContent = {
  title: string;
  path: string;
  isGlobal: boolean;
};

export const MyAccountPage = (): JSX.Element => {
  const { impersonateAddress, isImpersonating } = useImpersonateAccount();
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.backend);
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const location = useLocation();

  const address = useMemo(() => {
    return !!params["walletAddress"] && params["walletAddress"].length > 1
      ? params["walletAddress"]
      : user.address ?? "";
  }, [user, params["walletAddress"]]);
  const userAddress = isImpersonating ? impersonateAddress : address;

  const tabs: TabContent[] = [
    {
      title: "Details",
      path: "detail",
      isGlobal: true,
    },
    {
      title: "Loans",
      path: "loans",
      isGlobal: false,
    },
    {
      title: "Offers",
      path: "offers",
      isGlobal: false,
    },
    {
      title: "Assets",
      path: "assets",
      isGlobal: true,
    },
    {
      title: "Activity",
      path: "activity",
      isGlobal: false,
    },
  ];

  const filteredTabs = tabs.filter(
    (tab: TabContent) => tab.isGlobal || (!!user && !params["walletAddress"])
  );

  let tab: string;
  if (location.pathname.includes("my-account")) {
    const pieces = location.pathname.split("/");
    tab = pieces.length === 2 ? "detail" : pieces[2] || "detail";
  } else {
    const pieces = location.pathname.split("/");
    tab = pieces.length === 3 ? "detail" : pieces[3] || "detail";
  }
  const activeTab = filteredTabs.findIndex((_tab) => _tab.path === tab);

  if (typeof address === "undefined" || !address) {
    return (
      <Box>
        <h1>Not logged in</h1>
        <p>Please connect to view your account</p>
      </Box>
    );
  }

  return (
    <Box>
      <Container>
        <AccountProfile address={userAddress} />
      </Container>
      <Box sx={{ borderBottom: 2, borderColor: "rgba(126, 154, 169, 0.20)", mb: "5em" }}>
        <Tabs value={activeTab} centered>
          {tabs
            .filter(
              (tab: TabContent) => tab.isGlobal || (!!user && !params["walletAddress"])
            )
            .map((tab: TabContent, tabIndex: number) => (
              <Link to={`${tab.path}${location.search}`}>
                <Tab
                  label={
                    <div
                      style={{
                        fontFamily: "Inter,Roboto,sans-serif",
                        fontWeight: "500",
                        fontSize: "1.2em",
                        color:
                          tabIndex === activeTab
                            ? themeType === "light"
                              ? "black"
                              : "white"
                            : "#8991A2",
                        padding: "8px 0px",
                        minWidth: "120px",
                      }}
                    >
                      {tab.title}
                    </div>
                  }
                  {...a11yProps(tabIndex)}
                  key={`tab-${tabIndex}`}
                />
              </Link>
            ))}
        </Tabs>
      </Box>
      <Outlet />
    </Box>
  );
};

export default MyAccountPage;
