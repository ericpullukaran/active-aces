export const getDuration = (startTime: Date, endTime: Date) => {
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  const parts = [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}m` : "",
    seconds ? `${seconds}s` : "",
  ]
    .filter(Boolean)
    .slice(0, 2);

  return parts.join(" ");
};
