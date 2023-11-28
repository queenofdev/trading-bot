import { SvgIcon } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const SymbolDescription = (props: { basicToken: string; dateRage: string }) => {
  const underlyingToken = useSelector((state: RootState) => state.app.underlyingToken);
  return (
    <div className="bg-[#0B1314] text-second xs:px-10 sm:px-15 py-5 rounded-xl flex items-center border-2 border-second xs:text-12 sm:text-16">
      <p>
        {underlyingToken.name}&nbsp;&#8725;&nbsp;{props.basicToken}
        &nbsp;&#8226;&nbsp;
        {props.dateRage}&nbsp;&#8226;&nbsp;TradingView
      </p>
      <SvgIcon component={FiberManualRecord} className="xs:text-16 sm:text-20 ml-10" />
    </div>
  );
};
