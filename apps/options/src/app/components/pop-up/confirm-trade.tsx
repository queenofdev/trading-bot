import { CurrencyDetails } from "@fantohm/shared-web3";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  SvgIcon,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  WatchLaterOutlined as WatchLaterOutlinedIcon,
  CallMade as HighArrowIcon,
  SouthEast as LowArrowIcon,
  CheckBoxOutlineBlank,
  Check,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

import { LabelIcon } from "../label-icon/label-icon";
import { convertTimeString, fixedFloatString } from "../../helpers/data-translations";

export function ConfirmTradePopup(props: {
  interval: number;
  currencyValue: number;
  selectedCurrency: CurrencyDetails;
  direction: "Up" | "Down";
  open: boolean;
  onClose: (isOpen: boolean) => void;
  handleBetting: (direction: "Up" | "Down") => void;
}) {
  const {
    interval,
    selectedCurrency,
    currencyValue,
    direction,
    open,
    onClose,
    handleBetting,
  } = props;
  const [isChecked, setChecked] = useState(false);

  const handleConfirm = async () => {
    onClose(false);
    await handleBetting(direction);
  };

  const handleClose = () => {
    onClose(false);
  };

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    localStorage.setItem("hide", JSON.stringify(event.target.checked));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-paperScrollPaper": {
          width: "480px",
          backgroundColor: "#0B0F10",
          borderRadius: "30px",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        className="w-full flex justify-between items-center"
      >
        <SvgIcon
          component={ArrowBackIcon}
          className="w-30 h-30 text-second p-5 rounded-full bg-heavybunker"
          onClick={handleClose}
        />
        <p className="text-primary">{"Confirm"}</p>
        <SvgIcon
          component={CloseIcon}
          className="w-30 h-30 text-second p-5 rounded-full bg-heavybunker"
          onClick={handleClose}
        />
      </DialogTitle>
      <DialogContent>
        <div className="rounded-3xl flex justify-between items-center px-10 py-5 bg-heavybunker mt-20 mb-10">
          <p className="text-second">Timeframe</p>
          <LabelIcon
            label={convertTimeString(interval)}
            icon={WatchLaterOutlinedIcon}
            reverse
            backgroundColor="woodsmoke"
            iconColor="success"
            className="w-100 rounded-2xl p-5"
          />
        </div>
        <div className="rounded-3xl flex justify-between items-center px-10 py-5 bg-heavybunker mb-10">
          <p className="text-second">Quantity</p>
          <LabelIcon
            label={fixedFloatString(currencyValue)}
            icon={() => (
              <img
                src={selectedCurrency.icon}
                alt={`${selectedCurrency.symbol} logo`}
                width={25}
              />
            )}
            reverse
            backgroundColor="woodsmoke"
            className="w-100 rounded-2xl p-5"
          />
        </div>
        <div className="rounded-3xl flex justify-between items-center px-10 py-5 bg-heavybunker mb-20">
          <p className="text-second">Type</p>
          <LabelIcon
            label={direction}
            icon={direction === "Up" ? HighArrowIcon : LowArrowIcon}
            reverse
            backgroundColor="woodsmoke"
            iconColor={`${direction === "Up" ? "success" : "danger"}`}
            className="w-100 rounded-2xl p-5"
          />
        </div>
        <p
          id="alert-dialog-description"
          className="border border-second rounded-xl text-primary p-20 text-center"
        >
          I understand that binary options trading carries significant risk and I am aware
          that I cannot cancel a trade once it has been place.
        </p>
        <div className="w-full flex justify-center mt-10">
          <FormControlLabel
            label="Don't show this message again"
            control={
              <Checkbox
                checked={isChecked}
                icon={<CheckBoxOutlineBlank className="bg-second text-second rounded" />}
                checkedIcon={<Check className="bg-second text-success rounded" />}
                onChange={handleChangeCheckBox}
              />
            }
            className="text-primary"
          />
        </div>
      </DialogContent>
      <DialogActions className="p-20">
        <button
          autoFocus
          className="w-full bg-success text-primary text-20 outline-none rounded-xl font-bold py-10"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmTradePopup;
