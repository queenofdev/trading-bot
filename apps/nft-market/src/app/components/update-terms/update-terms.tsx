import { Box, Dialog, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Listing } from "../../types/backend-types";
import TermsForm from "../terms-form/terms-form";
import style from "./update-terms.module.scss";

export interface UpdateTermsProps {
  listing: Listing;
  onClose: (value: boolean) => void;
  open: boolean;
}

export const UpdateTerms = (props: UpdateTermsProps): JSX.Element => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ padding: "1.5em" }} fullWidth>
      <Box className="flex fr fj-c">
        <h1 style={{ margin: "0 0 0.5em 0" }}>Update terms</h1>
      </Box>
      <Box
        className={`flex fr fj-fe ${style["header"]}`}
        sx={{ position: "absolute", right: "16px" }}
      >
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <Box
        className={`flex fc ${style["body"]}`}
        sx={{ borderTop: "1px solid #aaaaaa", paddingTop: "1em" }}
      >
        <TermsForm
          key={`update-terms-${props.listing.id}`}
          type="borrow"
          asset={props.listing.asset}
          listing={props.listing}
          offerTerm={props.listing.term}
          onClose={onClose}
        />
      </Box>
    </Dialog>
  );
};

export default UpdateTerms;
