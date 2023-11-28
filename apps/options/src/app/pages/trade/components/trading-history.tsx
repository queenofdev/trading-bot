import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import { HistoryProps } from "../../../core/types/types";
import {
  financialFormatter,
  convertTime,
  fixedFloatString,
} from "../../../helpers/data-translations";
import { Betting_History_Tabs } from "../../../core/constants/basic";
import { mockupHistoryData } from "../../../mockup/data";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel = (props: TabPanelProps) => {
  let data;
  const { value, index, ...other } = props;
  switch (value) {
    case 0:
      data = mockupHistoryData;
      break;
    case 1:
      data = mockupHistoryData.filter((item) => item.open && !item.close);
      break;
    case 2:
      data = mockupHistoryData.filter((item) => item.status);
      break;
    case 3:
      data = mockupHistoryData.filter((item) => !item.status);
      break;
    case 4:
      data = mockupHistoryData.filter((item) => item.payout);
      break;
    default:
      data = mockupHistoryData;
      break;
  }
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {data.map((item: HistoryProps, index) => {
        return (
          <div
            className="w-full grid xs:grid-cols-3 sm:grid-cols-5 xs:py-10 md:py-20 border-b-2 border-second gap-20"
            key={index}
          >
            <div className="type ">
              <p className="text-second xs:text-14 sm:text-17">Type</p>
              <p className="text-primary xs:text-15 sm:text-18">{item.type}</p>
            </div>
            <div className="asset ">
              <p className="text-second xs:text-14 sm:text-17">Asset</p>
              <p className="text-primary xs:text-15 sm:text-18">{item.asset}</p>
            </div>
            <div className="quantity">
              <p className="text-second xs:text-14 sm:text-17">Quantity</p>
              <p className="text-primary xs:text-15 sm:text-18">
                {item.quantity}&nbsp;DAI
              </p>
            </div>
            <div className="payout">
              <p className="text-second xs:text-14 sm:text-17">Payout</p>
              <p className="text-primary xs:text-15 sm:text-18">
                {item.payout ? fixedFloatString(item.payout) + " DAI" : "-"}
              </p>
            </div>
            <div className="status">
              <p className="text-second xs:text-14 sm:text-17">Status</p>
              <p
                className={`${
                  item.status ? "text-success" : "text-danger"
                } xs:text-15 sm:text-18`}
              >
                {item.status ? "Win" : "Loss"}
              </p>
            </div>
            <div className="open">
              <p className="text-second xs:text-14 sm:text-17">Open</p>
              <p className="text-primary xs:text-15 sm:text-18">
                {item.open ? financialFormatter.format(item.open) : "-"}
              </p>
            </div>
            <div className="close">
              <p className="text-second xs:text-14 sm:text-17">Close</p>
              <p className="text-primary xs:text-15 sm:text-18">
                {item.close ? financialFormatter.format(item.close) : "-"}
              </p>
            </div>
            <div className="time">
              <p className="text-second xs:text-14 sm:text-17">Time</p>
              <p className="text-primary xs:text-15 sm:text-18 break-all">
                {convertTime(item.time).time}&nbsp;
                <span className="inline-block">{convertTime(item.time).date}</span>
              </p>
            </div>
            <div className="expiration">
              <p className="text-second xs:text-14 sm:text-17">Expiration</p>
              <p className="text-primary xs:text-15 sm:text-18 break-all">
                {convertTime(item.expiration).time}&nbsp;
                <span className="inline-block">{convertTime(item.expiration).date}</span>
              </p>
            </div>
            <div className="Timer">
              <p className="text-second xs:text-14 sm:text-17">Timer</p>
              <p className="text-primary xs:text-15 sm:text-18">
                {item.timer ? item.timer : "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TradingHistory = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const a11yProps = (index: number): any => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <Box sx={{ width: "100%", color: "#c1d6eb" }}>
      <Box sx={{ borderBottom: 1, borderColor: "#48565d" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{ minHeight: "unset" }}
        >
          {Betting_History_Tabs.map((tab: string, index) => (
            <Tab
              label={tab}
              {...a11yProps(index)}
              className="text-second focus:text-primary block w-1/5 xs:text-12 md:text-16 xs:p:5 sm:p-10"
              sx={{
                minHeight: "unset",
                minWidth: "unset",
              }}
              key={index}
            />
          ))}
        </Tabs>
      </Box>
      {Betting_History_Tabs.map((tab: string, index) => (
        <TabPanel value={value} index={index} key={index} />
      ))}
    </Box>
  );
};

export default TradingHistory;
