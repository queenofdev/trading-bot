import * as React from "react";
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  IChartingLibraryWidget,
  ResolutionString,
} from "../../../assets/tradingview_library/charting_library";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
  timeFrames: ChartingLibraryWidgetOptions["time_frames"];
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
}

export class TVChartContainer extends React.PureComponent<Partial<ChartContainerProps>> {
  public static defaultProps: Omit<ChartContainerProps, "container"> = {
    symbol: "AAPL",
    interval: "D" as ResolutionString,
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/assets/tradingview_library/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    timeFrames: [
      { text: "1d", resolution: "1" as ResolutionString },
      { text: "2d", resolution: "5" as ResolutionString },
      { text: "3d", resolution: "15" as ResolutionString },
    ],
  };

  private tvWidget: IChartingLibraryWidget | null = null;
  private ref: React.RefObject<HTMLDivElement> = React.createRef();

  public override componentDidMount(): void {
    if (!this.ref.current) {
      return;
    }

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this.props.symbol as string,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        this.props.datafeedUrl
      ),
      interval: this.props.interval as ChartingLibraryWidgetOptions["interval"],
      container: this.ref.current,
      library_path: this.props.libraryPath as string,

      locale: getLanguageFromURL() || "en",
      disabled_features: [
        "use_localstorage_for_settings",
        "show_spread_operators",
        "snapshot_trading_drawings",
        "timeframes_toolbar",
        "trading_floating_toolbar",
        "header_widget",
        "adaptive_logo",
        "widget_logo",
      ],
      enabled_features: ["study_templates", "logo_without_link"],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      toolbar_bg: "#0B0F10",
      overrides: {
        "paneProperties.background": "#090B0D",
        "paneProperties.vertGridProperties.color": "#0D1112",
        "paneProperties.horzGridProperties.color": "#444D55",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#AAA",
        "toolsPanProperties.textColor": "#ffffff",
        "drawingToolsProperties.textColor": "#ffffff",
      },
      custom_css_url: "../themed.css",
    };

    const tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            },
          })
        );
        button.innerHTML = "Check API";
      });
    });
  }

  public override componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  public override render(): JSX.Element {
    return <div ref={this.ref} className={"TVChartContainer h-full"} />;
  }
}
