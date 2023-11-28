import { addressEllipsis } from "@fantohm/shared-helpers";
import { SvgIcon } from "@mui/material";
import HighArrowIcon from "@mui/icons-material/CallMade";
import { TransactionProps } from "../../core/types/types";

const Transaction = (props: { tx: TransactionProps; ranking: number }) => {
  const { tx, ranking } = props;
  return (
    <div className="transaction text-lightgray">
      <div className="body grid grid-rows-1 grid-cols-12 xs:px-10 sm:px-20 md:px-35 xl:px-45 bg-woodsmoke xs:py-15 md:py-30 rounded-3xl my-10 xs:text-16 lg:text-20">
        <div className="ranking flex justify-start items-center text-primary">
          <p>{ranking}</p>
        </div>
        <div className="user pl-20 xs:col-span-7 sm:col-span-4 md:col-span-4 lg:col-span-3 text-primary flex items-center">
          <div className="rounded-full bg-[#161B1D] xs:w-15 xs:h-15 sm:w-25 sm:h-25 flex justify-center items-center mr-10">
            <img src={`./assets/images/avatar-account.png`} alt={`account logo`} />
          </div>
          <p>{addressEllipsis(tx.to)}</p>
        </div>
        <div className="payout xs:col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 text-success flex items-center">
          <p>{tx.data}</p>
        </div>
        {
          <div className="token-pair xs:hidden sm:grid sm:col-span-4 md:col-span-3 xl:col-span-2 text-primary">
            <div className="flex justify-start items-center mr-10">
              <img
                src={`./assets/images/${tx.tokenPair.icon}.png`}
                alt={`${tx.tokenPair.name} logo`}
              />
              <p>{tx.tokenPair.name}</p>
            </div>
          </div>
        }
        <div className="date xs:hidden xl:grid col-span-2 text-primary flex items-center">
          <p>{tx.timestamp}</p>
        </div>
        <div className="action xs:hidden lg:grid md:col-span-2 lg:col-span-2 xl:col-span-2 text-primary">
          <div className="h-full flex items-center">
            <a className="underline" href={tx.tx} target="_blank" rel="noreferrer">
              View&nbsp;on&nbsp;Explorer
            </a>
            <SvgIcon className="text-18 ml-5" component={HighArrowIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
