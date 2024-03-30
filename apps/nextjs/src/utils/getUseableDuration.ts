export const getUseableDuration = (startTime: Date | undefined | null) => {
  const currentTime = new Date();
  const diff = currentTime.valueOf() - (startTime ?? currentTime).valueOf();

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
