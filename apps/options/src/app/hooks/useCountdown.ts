export const useCountdown = (counter: number) => {
  const days = Math.floor(counter / (1000 * 60 * 60 * 24));
  const hours = Math.floor((counter % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((counter % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((counter % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, counter };
};
