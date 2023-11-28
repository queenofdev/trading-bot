import { TransactionProps } from "../core/types/types";
import { HistoryProps } from "../core/types/types";

export const transactions: TransactionProps[] = [
  {
    tx: "https://etherscan.io/tx/0xcb2cf44cc3fa42975da86cc03b4b417436fd9ee8d30485dcb337e288d74e267b",
    from: "0x177b8ebe208cb71da818b6b8814c946c027240cd",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    timestamp: "08:59:31 26-9-22",
    tokenPair: {
      name: "ETH/DAI",
      icon: "eth-dai",
    },
    data: "$1,349,93.06",
  },
  {
    tx: "https://etherscan.io/tx/0xcb2cf44cc3fa42975da86cc03b4b417436fd9ee8d30485dcb337e288d74e267b",
    from: "0x177b8ebe208cb71da818b6b8814c946c027240cd",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    timestamp: "08:59:31 26-9-22",
    tokenPair: {
      name: "ETH/DAI",
      icon: "eth-dai",
    },
    data: "$838,14.58",
  },
  {
    tx: "https://etherscan.io/tx/0xcb2cf44cc3fa42975da86cc03b4b417436fd9ee8d30485dcb337e288d74e267b",
    from: "0x177b8ebe208cb71da818b6b8814c946c027240cd",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    timestamp: "08:59:31 26-9-22",
    tokenPair: {
      name: "ETH/DAI",
      icon: "eth-dai",
    },
    data: "$598,492.14",
  },
  {
    tx: "https://etherscan.io/tx/0xcb2cf44cc3fa42975da86cc03b4b417436fd9ee8d30485dcb337e288d74e267b",
    from: "0x177b8ebe208cb71da818b6b8814c946c027240cd",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    timestamp: "08:59:31 26-9-22",
    tokenPair: {
      name: "ETH/DAI",
      icon: "eth-dai",
    },
    data: "$532,983.05",
  },
  {
    tx: "https://etherscan.io/tx/0xcb2cf44cc3fa42975da86cc03b4b417436fd9ee8d30485dcb337e288d74e267b",
    from: "0x177b8ebe208cb71da818b6b8814c946c027240cd",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    timestamp: "08:59:31 26-9-22",
    tokenPair: {
      name: "ETH/DAI",
      icon: "eth-dai",
    },
    data: "$384,872.31",
  },
];

export const mockupHistoryData: HistoryProps[] = [
  {
    type: "Up",
    asset: "ETH/DAI",
    quantity: 650,
    payout: 1300,
    open: 1343,
    close: undefined,
    time: new Date(),
    expiration: new Date(),
    timer: undefined,
    status: true,
  },
  {
    type: "Up",
    asset: "ETH/DAI",
    quantity: 650,
    payout: undefined,
    open: 1343,
    close: 1339.64,
    time: new Date(),
    expiration: new Date(),
    timer: undefined,
    status: false,
  },
  {
    type: "Up",
    asset: "ETH/DAI",
    quantity: 650,
    payout: undefined,
    open: 1343,
    close: 1339.64,
    time: new Date(),
    expiration: new Date(),
    timer: undefined,
    status: false,
  },
];
