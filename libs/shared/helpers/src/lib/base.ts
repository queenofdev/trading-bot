import { ethers } from "ethers";

export const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tab-panel-${index}`,
  };
};

export const scientificToDecimal = (num: any) => {
  const sign = Math.sign(num);
  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    const zero = "0";
    const parts = String(num).toLowerCase().split("e"); //split into coeff and exponent
    const e = parts.pop(); //store the exponential part
    let l = Math.abs(Number(e)); //get the number of zeros
    const direction = Number(e) / l; // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split(".");

    if (direction === -1) {
      coeffArray[0] = String(Math.abs(Number(coeffArray[0])));
      num = zero + "." + new Array(l).join(zero) + coeffArray.join("");
    } else {
      const dec = coeffArray[1];
      if (dec) l = l - dec.length;
      num = coeffArray.join("") + new Array(l + 1).join(zero);
    }
  }

  if (sign < 0) {
    num = -num;
  }

  return num;
};

export const truncateDecimals = (number: any, digits = 2) => {
  const multiplier = Math.pow(10, digits);
  const adjustedNum = number * multiplier;
  const truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);
  return truncatedNum / multiplier;
};

export const formatSeconds = (duration: number) => {
  const hrs = parseInt((duration / 3600).toString(), 10);
  const mins = parseInt(((duration % 3600) / 60).toString(), 10);
  const secs = duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let result = "";
  if (hrs > 0) {
    result += "" + (hrs < 10 ? "0" + hrs : hrs) + "h :";
  }
  result +=
    "" + (mins < 10 ? "0" + mins : mins) + "m :" + (secs < 10 ? "0" + secs : secs) + "s";
  return result;
};

export const formatAmount = (
  amount: number,
  decimals: number | string,
  length = 2,
  truncate = false
): number => {
  if (!amount || !decimals || isNaN(amount)) {
    return 0;
  }
  const result = ethers.utils.formatUnits(scientificToDecimal(amount), decimals);
  if (truncate) {
    return truncateDecimals(result, length);
  } else {
    return parseInt(result);
  }
};

export function formatCurrency(c: number, precision = 0): string {
  const currencyStr = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
  if (parseFloat(currencyStr) === parseInt(currencyStr) && precision < 6)
    // show decimals by 6 digits at most
    return formatCurrency(c, precision + 1);
  return currencyStr;
}
