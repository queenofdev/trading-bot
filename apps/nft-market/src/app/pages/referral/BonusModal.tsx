import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import nftImage from "../../../assets/images/bored-ape-yacht-club.png";
import LaunchIcon from "@mui/icons-material/Launch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};

export default function BonusModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    window.open("https://opensea.io/collection/balance-pass", "_blank");
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Balance Pass Bonus
            </Typography>
            <img
              src={
                "https://i.seadn.io/gae/CVFyOVeQcwXgfWT2XAmUcevFxKlYQZE7CxDPH4bbvwTF4LfryieEw0JN8sZJMc8bqLbtA_1Obgs9ZcL9uYvoL_x18XhBHLqUi9qYZOc?auto=format&w=384"
              }
              alt=""
              className="nft-image"
            />
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Earn an additional 5% in rewards when you hold a Balance Pass in your wallet
            </Typography>
            <Button variant="contained" endIcon={<LaunchIcon />} onClick={handleClick}>
              View on Opensea
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
