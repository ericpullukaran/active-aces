import { RouterInputs } from "@acme/api";
import commaNumber from "comma-number";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getDuration } from "~/utils/durationCalculations";
import { useExercises } from "~/utils/exercises";
import { fonts } from "~/utils/fonts";
import { Workout, getWorkoutVolume } from "~/utils/workouts";

type Props = {
  workout: Workout;
};

export default function HistoryCard({ workout: item }: Props) {
  const router = useRouter();
  const exercises = useExercises();

  return (
    <TouchableOpacity
      className="mb-8 rounded-lg bg-base-100 p-4"
      onPress={() => {
        router.push(item.endTime ? `/history/${item.id}` : `/create_workout`);
      }}
    >
      <View className="mb-4 flex flex-row items-center justify-between">
        <Text
          style={{ fontFamily: fonts.inter.semiBold }}
          className="text-lg text-white"
        >
          {item.name}
          {item.endTime ? "" : " (in progress)"}
        </Text>
      </View>

      <View className="mb-4 space-y-2">
        {item.exercises.map((exercise) => (
          <View key={exercise.id}>
            <Text
              className="text-sm text-gray-300"
              style={{ fontFamily: fonts.inter.medium }}
            >
              {exercises.dataAsMap?.[exercise.exerciseId]?.name ?? "..."} -{" "}
              {exercise.sets.length} sets
            </Text>
          </View>
        ))}

        {item.exercises.length === 0 && (
          <Text className="text-sm text-gray-300">No exercises 😔</Text>
        )}
      </View>

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-500">Duration</Text>
          <Text className="text-sm text-gray-300">
            {item.endTime ? getDuration(item.startTime, item.endTime) : "-"}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-gray-500">Start time</Text>
          <Text className="text-sm text-gray-300">
            {item.startTime.toLocaleTimeString()},{" "}
            {item.startTime.toLocaleDateString()}
          </Text>
        </View>

        <View>
          <Text className="text-xs text-gray-500">Volume</Text>
          <Text className="text-sm text-gray-300">
            {commaNumber(getWorkoutVolume(item))}kg
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
