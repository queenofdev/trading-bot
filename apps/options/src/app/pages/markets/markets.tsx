import Footer from "../../components/footer/footer";
import TrendingMarket from "../../components/trending/trending-market";
import { CryptoCurrency } from "../../core/types/types";
import { Betting_CryptoCurrencies } from "../../core/constants/basic";

export const Markets = (): JSX.Element => {
  return (
    <>
      <div className="xs:px-5 sm:px-40 md:px-90 bg-heavybunker grow cursor-default flex flex-col xs:pt-120">
        <div className="title xs:flex flex-col items-center sm:block xs:px-20 sm:px-40 py-20 xs:mt-10 xs:mb-40 sm:my-10 sm:mb-50 bg-cover sm:bg-[url('./assets/images/bg-market-sm.png')] lg:bg-[url('./assets/images/bg-market-lg.png')] bg-no-repeat  rounded-2xl">
          <p className="xs:text-35 sm:text-40 text-primary">Markets</p>
          <p className="xs:text-16 sm:text-22 text-second">Top payouts of all time</p>
        </div>
        <div className="grow trending-markets flex flex-col">
          <div className="pads-title grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 px-20 xs:text-15 sm:text-17 text-lightgray">
            <div className="col-span-2">Pair</div>
            <div className="">Price</div>
            <div className="xs:hidden sm:block">24h change</div>
            <div className="xs:hidden md:block">24h vol</div>
            <div className="xs:hidden xl:block">Jackpot</div>
            <div className="col-span-2 xs:hidden lg:block">24h chart</div>
            <div className="xs:hidden sm:block"></div>
          </div>
          <div className="">
            {Betting_CryptoCurrencies.map((item: CryptoCurrency) => {
              return (
                <TrendingMarket
                  sourceToken="DAI"
                  underlyingToken={item}
                  isJackpot={true}
                  key={item.symbol}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Markets;
