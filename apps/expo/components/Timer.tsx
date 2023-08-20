import React, { useState } from "react";
import { Text } from "react-native";
import useInterval from "~/utils/useInterval";

type Props = {
  fromTime: Date;
  classes?: string;
};

const getFormattedTime = (startTime: Date) => {
  const elapsedSeconds = (Date.now() - startTime.getTime()) / 1000;
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = Math.floor(elapsedSeconds % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return formattedTime;
};

export default function Timer({ fromTime, classes }: Props) {
  const [duration, setDuration] = useState<string>();

  useInterval(() => {
    setDuration(getFormattedTime(fromTime));
  }, 100);

  return (
    <Text className={classes} style={{ fontVariant: ["tabular-nums"] }}>
      {duration}
    </Text>
  );
}
