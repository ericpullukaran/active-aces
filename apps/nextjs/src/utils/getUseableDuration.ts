export const getUseableDuration = (
  startTime: Date | string | undefined | null,
) => {
  const currentTime = new Date();
  const parsedStartTime =
    typeof startTime === "string" ? new Date(startTime) : startTime;
  const diff =
    currentTime.valueOf() - (parsedStartTime ?? currentTime).valueOf();

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  let formattedDuration = "";
  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }
  formattedDuration += `${minutes}:${seconds}`;

  return formattedDuration;
};
