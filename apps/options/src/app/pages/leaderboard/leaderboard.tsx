import Footer from "../../components/footer/footer";
import Transaction from "../../components/transaction/transaction";
import { transactions } from "../../mockup/data";

export const Leaderboard = (): JSX.Element => {
  return (
    <>
      <div className="xs:px-5 sm:px-40 md:px-90 xs:pt-120 bg-heavybunker grow cursor-default">
        <div className="title xs:flex flex-col items-center sm:block xs:px-20 sm:px-40 py-20 xs:mt-10 xs:mb-40 sm:my-10 sm:mb-50 bg-cover sm:bg-[url('./assets/images/bg-leaderboard-sm.png')] lg:bg-[url('./assets/images/bg-leaderboard-lg.png')] bg-no-repeat  rounded-2xl">
          <p className="xs:text-34 sm:text-40 text-primary">Leaderboard</p>
          <p className="xs:text-18 sm:text-22 text-second">Top payouts of all time</p>
        </div>
        <div className="leaderboard-pad">
          <div className="w-full leaderboard-title grid grid-rows-1 grid-cols-12 xs:px-10 sm:px-20 md:px-35 xl:px-50 xs:my-10 md:my-20 text-primary xs:text-15 sm:text-20">
            <div className="ranking flex justify-start items-center text-second">
              <code className="font-InterRegular text-17">Rank</code>
            </div>
            <div className="user pl-20 xs:col-span-7 sm:col-span-4 md:col-span-4 lg:col-span-3 text-second flex items-center">
              <code className="font-InterRegular text-17">User</code>
            </div>
            <div className="payout xs:col-span-4 sm:col-span-3 md:col-span-3 lg:col-span-2 flex items-center text-second">
              <code className="font-InterRegular text-17">Payout</code>
            </div>
            <div className="token-pair xs:hidden sm:grid sm:col-span-4 md:col-span-3 xl:col-span-2 text-second">
              <code className="font-InterRegular text-17">Pair</code>
            </div>
            <div className="date xs:hidden xl:grid col-span-2 flex items-center text-second">
              <code className="font-InterRegular text-17">Date</code>
            </div>
            <div className="action xs:hidden lg:grid md:col-span-2 lg:col-span-2 xl:col-span-2 text-second"></div>
          </div>
          <div className="w-full leaderboard-body">
            {transactions.map((transaction, index) => (
              <Transaction tx={transaction} ranking={index + 1} key={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Leaderboard;
