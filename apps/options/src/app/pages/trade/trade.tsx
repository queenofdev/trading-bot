import { Button, Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import TradingViewChart from "./components/tradingview-chart";
import TradingHistory from "./components/trading-history";
import TradingPad from "./components/trading-pad";
import Chat from "../../components/chat/chat";
import { setUnderlyingToken } from "../../store/reducers/app-slice";
import { useCurrencyDetail } from "../../hooks/useCurrencyDetail";
import { useTradeHistory } from "../../hooks/useTradeQuery";

const Trade = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const tradeHistoryData = useTradeHistory();
  console.log("tradeHistoryData: ", tradeHistoryData);
  const underlyingToken = useCurrencyDetail(params.get("underlyingToken"));

  useEffect(() => {
    dispatch(setUnderlyingToken(underlyingToken));
  }, [params]);

  return (
    <div className="grow w-full bg-heavybunker xs:px-10 sm:px-20 md:px-40 lg:px-70 xs:py-90 md:py-145 grid xs:grid-cols-1 md:grid-cols-5 xs:gap-10 md:gap-30">
      <div className="md:col-span-3">
        <TradingViewChart />
      </div>
      <div className="trade-pad md:col-span-2">
        <div className="xs:hidden sm:flex justify-center">
          <TradingPad />
        </div>
        <div className="action text-white text-center xs:px-10 xs:py-10 sm:py-20 md:py-30 sm:px-35 md:px-15 lg:px-35 xs:block sm:hidden">
          <div className="w-full  flex flex-col items-center">
            <Button
              className="w-full max-w-450 bg-success rounded-2xl xs:py-10 sm:py-15 mb-5 text-white xs:text-20 sm:text-26"
              onClick={handleOpen}
            >
              UP
            </Button>
            <Button
              className="w-full max-w-450 bg-danger rounded-2xl xs:py-10 sm:py-15 text-white xs:text-20 sm:text-26"
              onClick={handleOpen}
            >
              DOWN
            </Button>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ position: "absolute", bottom: "0px" }}
            className="flex justify-center items-end"
          >
            <div className="absolute bottom-0">
              <TradingPad />
            </div>
          </Modal>
        </div>
      </div>
      <div className="trading-history md:col-span-3">
        <TradingHistory />
      </div>
      <div className="chat md:col-span-2">
        <div className="flex justify-center">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Trade;
