import { Button, Dialog } from "@mui/material";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Dispatch, SetStateAction } from "react";

export type OfferConfirmDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onEdit: () => void;
  onRemove: () => void;
};

const OfferConfirmDialog = (props: OfferConfirmDialogProps): JSX.Element => {
  const { open, setOpen, onEdit, onRemove } = props;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">You have already active offer.</DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onEdit();
          }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
            onRemove();
          }}
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default OfferConfirmDialog;
