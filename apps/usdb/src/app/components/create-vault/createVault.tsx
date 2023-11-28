import {
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import style from "./createVault.module.scss";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { BaseSyntheticEvent, useState } from "react";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { currencyInfo } from "@fantohm/shared-web3";

export interface CreateVaultProps {
  onClose: (value: boolean) => void;
  open: boolean;
}

export const CreateVaultForm = (props: CreateVaultProps): JSX.Element => {
  const { onClose, open } = props;
  const [formStatus, setFormStatus] = useState(false);
  const [vaultName, setVaultName] = useState("");
  const [vaultFundingAmount, setVaultFundingAmount] = useState("");
  const [vaultDuration, setVaultDuration] = useState("");
  const [vaultApr, setVaultApr] = useState("");
  const [vaultCurrency, setVaultCurrency] = useState("");
  const [vaultDescription, setVaultDescription] = useState("");
  const [vaultWalletAddress, setVaultWalletAddress] = useState("");
  const [vaultProposalURL, setVaultProposalURL] = useState("");
  const [vaultTwitterURL, setVaultTwitterURL] = useState("");
  const [vaultDiscordURL, setVaultDiscordURL] = useState("");
  const [vaultWebsiteURL, setVaultWebsiteURL] = useState("");
  const [vaultDocumentationURL, setvaultDocumentationURL] = useState("");

  const handleClose = () => {
    onClose(false);
    setFormStatus(false);
  };

  const nextForm = () => {
    setFormStatus(true);
  };
  const previousForm = () => {
    setFormStatus(false);
  };
  const handleNameChange = (newName: string) => {
    setVaultName(newName);
  };
  const handleFundingAmount = (newAmount: string) => {
    setVaultFundingAmount(newAmount);
  };
  const handleDuration = (newDuration: string) => {
    setVaultDuration(newDuration);
  };
  const handleApr = (newApr: string) => {
    setVaultApr(newApr);
  };
  const handleDescription = (newDescription: string) => {
    setVaultDescription(newDescription);
  };
  const handleWalletAddress = (newWalletAddress: string) => {
    setVaultWalletAddress(newWalletAddress);
  };
  const handleProposalURL = (newProposalURL: string) => {
    setVaultProposalURL(newProposalURL);
  };
  const handleWebsiteURL = (newWebsiteURL: string) => {
    setVaultWebsiteURL(newWebsiteURL);
  };
  const handleTwitterURL = (newTwitterURL: string) => {
    setVaultTwitterURL(newTwitterURL);
  };
  const handleDiscordURL = (newDiscordURL: string) => {
    setVaultDiscordURL(newDiscordURL);
  };
  const handleDocumentationURL = (newDocumentationURL: string) => {
    setvaultDocumentationURL(newDocumentationURL);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          background: "black",
          border: "1px solid #101112",
          maxWidth: "800px",
        },
      }}
      sx={{ padding: "3em" }}
      fullWidth
    >
      {formStatus ? (
        <Box className="flex fr" sx={{ position: "absolute", left: "16px" }}>
          <IconButton onClick={previousForm}>
            <ArrowCircleLeftOutlinedIcon htmlColor="grey" fontSize="large" />
          </IconButton>
        </Box>
      ) : (
        ""
      )}

      <Box className="flex fr fj-c" sx={{ display: "flex", justifyContent: "center" }}>
        <h1 style={{ margin: "0 0 0.5em 0" }}>Create Vault</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon htmlColor="grey" fontSize="large" />
        </IconButton>
      </Box>
      <Box
        className={`flex fc ${style["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "1em" }}
      >
        {!formStatus ? (
          <Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "20%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Vault Name
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="Enter Name"
                  value={vaultName}
                  onChange={(e: BaseSyntheticEvent) => handleNameChange(e.target.value)}
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "43%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Desired funding amount ($)
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultFundingAmount}
                  onChange={(e: BaseSyntheticEvent) =>
                    handleFundingAmount(e.target.value)
                  }
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="$ 0.00"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "48%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Desired funding duration (days)
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultDuration}
                  onChange={(e: BaseSyntheticEvent) => handleDuration(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="0"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "35%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Designed APR (%)
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultApr}
                  onChange={(e: BaseSyntheticEvent) => handleApr(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="0.00%"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "32%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Desired Currencies
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <Box sx={{ mt: "30px" }}>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Select Currency</InputLabel>
                    <Select variant="standard" value="">
                      <MenuItem value="">Select Currency</MenuItem>
                      {Object.entries(currencyInfo).map(([tokenId, currencyDetails]) => (
                        <MenuItem
                          value={currencyDetails.symbol}
                          key={`currency-option-item-${tokenId}`}
                        >
                          <Box className="flex fr ai-c">
                            <img
                              style={{
                                height: "28px",
                                width: "28px",
                                marginRight: "5px",
                              }}
                              src={currencyDetails.icon}
                              alt={`${currencyDetails.symbol} Token Icon`}
                            />
                            {currencyDetails.symbol}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "20%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Description
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultDescription}
                  onChange={(e: BaseSyntheticEvent) => handleDescription(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="Write a brief explanation of the purpose of this vault and
                the intended use of funding. You can also paste links
                here to Youtube and Vimeo videos."
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "43%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Wallet Address
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultWalletAddress}
                  onChange={(e: BaseSyntheticEvent) =>
                    handleWalletAddress(e.target.value)
                  }
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g the wallet address to receive the funding"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "48%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Documentation URL
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultDocumentationURL}
                  onChange={(e: BaseSyntheticEvent) =>
                    handleDocumentationURL(e.target.value)
                  }
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g www.yoursite.com/documentation.pdf"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "35%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Proposal URL
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultProposalURL}
                  onChange={(e: BaseSyntheticEvent) => handleProposalURL(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g www.yoursite.com/proposal.pdf"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "32%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Website URL
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultWebsiteURL}
                  onChange={(e: BaseSyntheticEvent) => handleWebsiteURL(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g www.yoursite.com"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "32%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Twitter URL
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultTwitterURL}
                  onChange={(e: BaseSyntheticEvent) => handleTwitterURL(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g www.twitter.com/yourusername"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
            <Box sx={{ mt: "30px" }}>
              <Box
                sx={{
                  display: "flex",
                  ml: "20px",
                  backgroundColor: "black",
                  zIndex: "10",
                  position: "relative",
                  width: "32%",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#3744E6",
                    mr: "5px",
                  }}
                >
                  *
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    color: "#8a99a8",
                  }}
                >
                  Discord URL
                </Typography>
              </Box>
              <Box sx={{ mt: "-15px" }}>
                <TextField
                  variant="standard"
                  value={vaultDiscordURL}
                  onChange={(e: BaseSyntheticEvent) => handleDiscordURL(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  InputLabelProps={{ style: { fontSize: 40 } }}
                  placeholder="e.g www.discord.com/yourservername"
                  sx={{
                    border: "solid 1px #101112",
                    borderRadius: "25px",
                    width: "100%",
                    padding: "20px 20px",
                  }}
                ></TextField>
              </Box>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {!formStatus ? (
            <Button
              variant="contained"
              onClick={nextForm}
              sx={{
                display: { md: "flex", width: "100%" },
                fontSize: "19px",
                backgroundColor: "#3744E6",
                color: "white",
                fontFamily: "sora",
                mt: "40px",
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                display: { md: "flex", width: "100%" },
                fontSize: "19px",
                backgroundColor: "#3744E6",
                color: "white",
                fontFamily: "sora",
                mt: "40px",
              }}
            >
              Submit form
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default CreateVaultForm;
