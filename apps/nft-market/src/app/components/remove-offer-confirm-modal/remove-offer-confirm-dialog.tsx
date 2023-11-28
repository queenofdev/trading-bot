import { Button, Dialog, Typography } from "@mui/material";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Dispatch, SetStateAction } from "react";
import DialogContent from "@material-ui/core/DialogContent";

export type RemoveConfirmDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onRemove: () => void;
};

const RemoveOfferConfirmDialog = (props: RemoveConfirmDialogProps): JSX.Element => {
  const { open, setOpen, onRemove } = props;
  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog">Are you sure?</DialogTitle>
      <DialogContent>
        <Typography>
          Do you really want to remove this offer? This process cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
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
export default RemoveOfferConfirmDialog;
