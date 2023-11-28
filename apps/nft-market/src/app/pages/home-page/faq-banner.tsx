import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IFaq {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
}

export const FaqBanner = ({ isDark }: { isDark: boolean }): JSX.Element => {
  const [data, setData] = React.useState<IFaq[]>([
    {
      id: 1,
      title: `Where does the NFT go?`,
      description: `The NFT goes into our escrow in the our smart contract. This smart contract has been audited by Hacken with a 10/10 score for security. Once a loan has been repaid in full, the NFT will be released back to its owner.`,
      expanded: true,
    },
    {
      id: 2,
      title: `What happens if the loan is not repaid?`,
      description: `In the event that the loan is not repaid, the NFT which was used as collateral is transferred to the wallet of the lender (the person who provided the liquidity).`,
      expanded: false,
    },
    {
      id: 3,
      title: `What if you only repay a portion of the loan?`,
      description: `This is not possible as the loan plus the interest can only be repaid in full. Users can either repay in full or they can't repay at all.`,
      expanded: false,
    },
    {
      id: 4,
      title: `How does Liqd prevent fake asset listings?`,
      description: `Only verified collections on Opensea and collections which have been manually approved by Liqd can be used as collateral for loans.`,
      expanded: false,
    },
  ]);

  const handleExpandClick = (obj: IFaq) => {
    const arr = data.map((v: any) => {
      return v.id === obj.id
        ? { ...obj, expanded: !obj.expanded }
        : { ...v, expanded: false };
    });
    setData(arr);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "100px", textAlign: "center" }}>
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px" },
          color: "#8FA0C3",
          fontFamily: "SequelBlack",
        }}
      >
        FAQs
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "30px", xl: "35px" },
          color: isDark ? "#CAD6EE" : "#0A0C0F",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "MonumentExtended",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        Frequently asked questions
      </Typography>
      {data.map((obj: IFaq) => (
        <Card
          key={obj.id}
          sx={{
            maxWidth: 831,
            marginInline: "auto",
            marginTop: "20px",
            boxShadow: "none",
            background: isDark ? "rgba(61,69,87,0.2)" : "rgba(61,69,87,0.04)",
          }}
        >
          <CardActions disableSpacing>
            <Typography
              sx={{
                fontSize: { xs: 18, sm: 25 },
                fontFamily: "inter",
                color: isDark ? "#DEE9FF" : "#0A0C0F",
              }}
            >
              {obj.title}
            </Typography>
            <ExpandMore
              expand={obj.expanded}
              onClick={() => handleExpandClick(obj)}
              aria-expanded={obj.expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon
                sx={{ color: isDark ? "#C7D5FF" : "#0A0C0F", fontSize: "36px" }}
              />
            </ExpandMore>
          </CardActions>
          <Collapse in={obj.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography
                sx={{
                  fontSize: 18,
                  fontFamily: "inter",
                  color: isDark ? "#8FA0C3" : "#7988A8",
                  textAlign: "left",
                }}
              >
                {obj.description}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </Box>
  );
};

export default FaqBanner;
