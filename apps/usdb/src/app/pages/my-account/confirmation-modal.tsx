import {
  Modal,
  Box,
  Typography,
  Fade,
  Paper,
  Icon,
  Button,
  SvgIcon,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { memo } from "react";

import { ReactComponent as Check } from "../../../assets/icons/check.svg";
import { ReactComponent as Cancel } from "../../../assets/icons/cancel.svg";
import style from "./my-account.module.scss";

export const ConfirmationModal = ({
  open,
  closeConfirmModal,
  onCancelBond,
}: {
  open: boolean;
  closeConfirmModal: () => void;
  onCancelBond: () => void;
}): JSX.Element => {
  return (
    <Modal open={open}>
      <Fade in={open}>
        <Paper
          className={style["confirmation-modal"]}
          sx={{ py: "2rem", px: "3rem", borderRadius: "0.5rem" }}
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="subtitle2"
              color="primary"
              className="font-weight-bold"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box mr="5px">
                <Icon component={InfoOutlinedIcon} fontSize="small" />
              </Box>
              Cancelling a bond incurs a 5% loss. Do you still want to proceed?
            </Typography>
          </Box>
          <Box display="flex" mt="20px">
            <Button
              className="thin"
              color="primary"
              variant="contained"
              onClick={onCancelBond}
              sx={{ display: "flex", alignItems: "center", mr: "10px", width: "120px" }}
            >
              <Box display="flex" alignItems="center" mr="5px">
                <SvgIcon
                  viewBox="0 0 20 20"
                  color="secondary"
                  component={Check}
                  fontSize="small"
                />
              </Box>
              OK
            </Button>
            <Button
              className="thin border"
              color="primary"
              variant="contained"
              onClick={closeConfirmModal}
              sx={{ display: "flex", alignItems: "center", width: "120px" }}
            >
              <Box display="flex" alignItems="center" mr="5px">
                <SvgIcon
                  viewBox="0 0 20 20"
                  color="primary"
                  component={Cancel}
                  fontSize="small"
                />
              </Box>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default memo(ConfirmationModal);
