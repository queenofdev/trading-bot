/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

export const formatDateTimeString = (time: Date, isOnlyDate = false) => {
  const locale = navigator.language;
  const year = time.toLocaleString("en-US", { year: "numeric" });
  const month = time.toLocaleString("en-US", { month: "short" });
  const day = time.toLocaleString("en-US", { day: "numeric" });
  const hours = time.getUTCHours() < 10 ? "0" + time.getUTCHours() : time.getUTCHours();
  const minutes =
    time.getUTCMinutes() < 10 ? "0" + time.getUTCMinutes() : time.getUTCMinutes();
  const seconds =
    time.getUTCSeconds() < 10 ? "0" + time.getUTCSeconds() : time.getUTCSeconds();
  const formattedDate =
    locale !== "en-US"
      ? `${Number(day) < 10 ? "0" + day : day}-${month}-${year}`
      : `${month}-${Number(day) < 10 ? "0" + day : day}-${year}`;

  return `${formattedDate}${
    isOnlyDate ? "" : ", " + hours + ":" + minutes + ":" + seconds + " UTC"
  }`;
};
