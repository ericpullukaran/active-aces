import React, { useRef } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { RouterOutputs } from "~/utils/trpc";
import { useExercises } from "~/utils/exercises";
import ExerciseCardHeader from "./ExerciseCardHeader";

const emptySetsByMeasurementType = {
  "weight-reps": { weight: 0, numReps: 0 },
  reps: { numReps: 0 },
  "time-distance": { time: 0, distance: 0 },
  time: { time: 0 },
};

const requiredFields = {
  "weight-reps": ["weight", "numReps"],
  reps: ["numReps"],
  "time-distance": ["time", "distance"],
  time: ["time"],
};

function ExerciseHistoryCard({
  value: exerciseInfo,
  index: exerciseIndex,
}: {
  value: NonNullable<RouterOutputs["workouts"]["get"]>["exercises"][number];
  index: number;
}) {
  const exercises = useExercises();
  const curExercise = exercises.dataAsMap?.[exerciseInfo.exerciseId];

  const curMesType =
    curExercise?.measurementType as keyof typeof emptySetsByMeasurementType;

  const getHeaders = () => {
    if (curMesType === "weight-reps") {
      return (
        <>
          <Text className="w-14 text-center text-sm font-medium text-white/30">
            Weight
          </Text>
          <Text className="w-14 text-center text-sm font-medium text-white/30">
            Reps
          </Text>
        </>
      );
    } else if (curMesType === "time-distance") {
      return (
        <>
          <Text className="w-14 overflow-hidden text-center text-sm font-medium text-white/30">
            Time
          </Text>
          <Text className="w-14 overflow-hidden text-center text-sm font-medium text-white/30">
            Dist.
          </Text>
        </>
      );
    } else if (curMesType === "time") {
      return (
        <Text className="w-14 text-center text-sm font-medium text-white/30">
          Time
        </Text>
      );
    } else if (curMesType === "reps") {
      return (
        <Text className="w-14 text-center text-sm font-medium text-white/30">
          Reps
        </Text>
      );
    }
  };

  const getMaxWeight = () => {
    if (curMesType === "weight-reps") {
      return exerciseInfo.sets.reduce(
        (acc, cur) =>
          (cur.weight as number) > acc ? (cur.weight as number) : acc,
        -Infinity,
      );
    }
    return 0;
  };

  const getTotalReps = () => {
    if (curMesType === "weight-reps" || curMesType === "reps") {
      return exerciseInfo.sets.reduce(
        (acc, cur) => (cur.numReps || 0) + acc,
        0,
      );
    }
    return 0;
  };
  const getTotalTime = () => {
    if (curMesType === "time" || curMesType === "time-distance") {
      return exerciseInfo.sets.reduce((acc, cur) => (cur.time || 0) + acc, 0);
    }
    return 0;
  };
  const getTotalDistance = () => {
    if (curMesType === "time-distance") {
      return exerciseInfo.sets.reduce((acc, cur) => (cur.time || 0) + acc, 0);
    }
    return 0;
  };

  const getRepsStatCard = () => (
    <View className="mt-2 h-8 flex-row items-center rounded-xl bg-base-100">
      <Text className="ml-3 text-lg font-semibold text-zinc-500">
        Total Reps
      </Text>
      <View className="mr-3 flex-1 items-end">
        <Text className="text-lg  font-semibold text-zinc-300">
          {getTotalReps()}
        </Text>
      </View>
    </View>
  );

  const getTimeStatCard = () => (
    <View className="mt-2 h-8 flex-row items-center rounded-xl bg-base-100">
      <Text className="ml-3 text-lg font-semibold text-zinc-500">
        Total Time
      </Text>
      <View className="mr-3 flex-1 items-end">
        <Text className="text-lg  font-semibold text-zinc-300">
          {getTotalTime()}min
        </Text>
      </View>
    </View>
  );

  const getSimpleStatCard = () => {
    if (curMesType === "weight-reps") {
      return (
        <>
          <View className="mt-2 h-8 flex-row items-center rounded-xl bg-base-100">
            <Text className="ml-3 text-lg font-semibold text-zinc-500">
              Max Weight
            </Text>
            <View className="mr-3 flex-1 items-end">
              <Text className="text-lg  font-semibold text-zinc-300">
                {getMaxWeight()}kg
              </Text>
            </View>
          </View>
          {getRepsStatCard()}
        </>
      );
    } else if (curMesType === "time-distance") {
      return (
        <>
          <View className="mt-2 h-8 flex-row items-center rounded-xl bg-base-100">
            <Text className="ml-3 text-lg font-semibold text-zinc-500">
              Total Distance
            </Text>
            <View className="mr-3 flex-1 items-end">
              <Text className="text-lg  font-semibold text-zinc-300">
                {getTotalDistance()}m
              </Text>
            </View>
          </View>
          {getTimeStatCard()}
        </>
      );
    } else if (curMesType === "time") {
      return getTimeStatCard();
    } else if (curMesType === "reps") {
      return getRepsStatCard();
    }
  };

  return (
    <View className="">
      <View className="mb-8">
        <ExerciseCardHeader
          sets={exerciseInfo.sets as any}
          name={curExercise?.name || ""}
          description={curExercise?.description || ""}
          onChange={() => {}}
          isHistoryView={true}
        />
        <View
          className={`absolute top-16 z-10 w-full ${
            exerciseInfo.sets.length === 0 ? "" : "bg-base-100"
          }`}
        >
          <View className="bg-base-300 h-14 w-full flex-row items-end justify-between rounded-xl bg-base-200 px-6 pb-1 ">
            <Text className="w-14 text-center text-sm font-medium text-white/30">
              Set #
            </Text>
            {getHeaders()}
          </View>
        </View>
      </View>
      <View className="w-full rounded-xl">
        <View>
          {(exerciseInfo.sets as any[]).map((set: any, index) => (
            <View
              key={index}
              className={`h-14 flex-row items-center justify-between ${
                index % 2 === 0 ? "bg-base-100" : "bg-base-200"
              } ${
                index === exerciseInfo.sets.length - 1 ? " rounded-b-xl " : ""
              } px-6`}
            >
              <Text className="w-14 whitespace-pre text-center text-sm text-white opacity-40">
                {index}
              </Text>
              {requiredFields[curMesType].map((measurement_type, index) => (
                <View
                  key={index}
                  className={`h-4/6 w-14 items-center justify-center rounded-xl pl-2 text-white`}
                >
                  <Text className="text-center text-lg text-zinc-300">
                    {set[measurement_type]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      {/* uncomment below for simple stat card at the bottom */}
      {/* {getSimpleStatCard()} */}
    </View>
  );
}

export default ExerciseHistoryCard;
