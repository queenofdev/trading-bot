import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";

import TrendingPad from "../../components/trending/trending-pad";
import TrendingMarket from "../../components/trending/trending-market";
import TradingExperience from "../../components/trading-experience/trading-experience";
import DemoAccount from "../../components/demo-account/demo-account";
import TradingCommunity from "../../components/trading-community/trading-community";
import Footer from "../../components/footer/footer";
import { CryptoCurrency } from "../../core/types/types";
import {
  Betting_CryptoCurrencies,
  Carousal_Responsive_Form,
} from "../../core/constants/basic";

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleTradeClick = () => {
    navigate("/trade?underlyingToken=eth");
  };
  return (
    <div className="bg-heavybunker xs:pt-70 md:pt-90 xs:bg-contain xs:bg-[url('./assets/images/xs-bg-img.jpg')] sm:bg-[url('./assets/images/bg-img-lg.png')] bg-no-repeat">
      <div className="landing-page">
        <div className="w-full xs:px-10 sm:px-30 md:px-70 pt-150">
          <div className="xs:w-270 sm:w-530 flex flex-col">
            <p className="text-success xs:text-14 md:text-16 font-OcrExtendedRegular xs:mb-5 sm:mb-10">
              CRYPTO BINARY OPTIONS
            </p>
            <div className="text-primary text-26 sm:text-32 md:text-43 lg:text-52 xl:text-55 xs:mb-10 sm:mb-30 leading-tight">
              <p>Trade crypto binary</p>
              <p>options on-chain</p>
            </div>
            <div className="flex justify-start items-center font-OcrExtendedRegular">
              <button
                className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-woodsmoke bg-success rounded-xl mr-20  uppercase"
                onClick={handleTradeClick}
              >
                Trade
              </button>
              <button className="xs:py-10 xs:px-30 sm:py-15 sm:px-60 text-18 text-white border border-success bg-aztec rounded-xl  uppercase">
                Demo
              </button>
            </div>
          </div>
          <Carousel
            className="xs:pt-50 md:pt-80 xl:pt-120"
            partialVisible={true}
            responsive={Carousal_Responsive_Form}
            arrows={false}
          >
            {Betting_CryptoCurrencies.map((item: CryptoCurrency) => {
              return (
                <TrendingPad sourceToken="DAI" underlyingToken={item} key={item.symbol} />
              );
            })}
          </Carousel>
        </div>
      </div>
      <div className="trending-markets xs:px-10 sm:px-30 md:px-70 xs:pt-50 md:pt-80 xl:pt-120">
        <p className="trending-markets-title xs:text-30 sm:text-40 text-primary mb-30">
          Trending markets
        </p>
        <div className="pads-title grid grid-rows-1 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 px-20 xs:text-15 sm:text-17 text-lightgray">
          <div className="col-span-2">Pair</div>
          <div className="">Price</div>
          <div className="xs:hidden sm:block">24h change</div>
          <div className="xs:hidden md:block">24h vol</div>
          <div className="col-span-2 xs:hidden lg:block">24h chart</div>
          <div className="xs:hidden sm:block"></div>
        </div>
        {Betting_CryptoCurrencies.map((item: CryptoCurrency) => {
          return (
            <TrendingMarket
              sourceToken="DAI"
              underlyingToken={item}
              isJackpot={false}
              key={item.symbol}
            />
          );
        })}
      </div>
      <div className="xs:px-10 sm:px-30 md:px-70">
        <TradingExperience />
      </div>
      <div className="grid xs:grid-rows-2 xs:grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 xs:gap-35 md:gap-60 lg:gap-90 xs:px-10 sm:px-30 md:px-70 xs:py-35 md:py-60 lg:py-90">
        <TradingCommunity />
        <DemoAccount />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
