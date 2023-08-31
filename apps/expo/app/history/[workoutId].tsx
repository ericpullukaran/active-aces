import {
  View,
  Text,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { trpc } from "~/utils/trpc";
import ExerciseHistoryCard from "~/components/ExerciseHistoryCard";
import Icon from "react-native-vector-icons/FontAwesome5";
import { FullHeightScrollView } from "~/components/FullHeightScrollView";

type Props = {};

const HistoryWorkoutItem = (props: Props) => {
  const router = useRouter();
  const params = useSearchParams();
  const workoutHistory = trpc.workouts.get.useQuery({
    id: params.workoutId as string,
  });
  const trpcContext = trpc.useContext();
  const deleteWorkout = trpc.workouts.delete.useMutation({
    onSuccess: () => {
      trpcContext.workouts.history.invalidate();
      router.back();
    },
  });

  return (
    <SafeAreaView>
      <FullHeightScrollView
        className="mx-4 h-full"
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className={"mb-4 px-1 py-2"}>
          <View className="mb-2">
            <Text className={"text-5xl font-medium text-white"}>
              {workoutHistory.data?.name}
            </Text>
          </View>
          <View className={"mt-2 flex-row flex-wrap gap-2"}>
            <View
              className={
                " flex-row items-center rounded-full bg-base-100 px-3 py-1"
              }
            >
              <Icon
                name="calendar"
                size={13}
                color={`white`}
                style={{ opacity: 0.5, marginRight: 5 }}
              />
              <Text className={"text-sm text-white"}>
                {workoutHistory.data?.startTime?.toLocaleDateString()}
              </Text>
            </View>
            <View
              className={
                " flex-row items-center rounded-full bg-base-100 px-3 py-1"
              }
            >
              <Icon
                name="clock"
                size={13}
                color={`white`}
                style={{ opacity: 0.5, marginRight: 5 }}
              />
              <Text className={"text-sm text-white"}>
                {workoutHistory.data?.endTime && workoutHistory.data?.startTime
                  ? `${Math.round(
                      (workoutHistory.data.endTime.getTime() -
                        workoutHistory.data.startTime.getTime()) /
                        (1000 * 60),
                    )} min`
                  : "N/A"}
              </Text>
            </View>
            <View
              className={
                " flex-row items-center rounded-full bg-base-100 px-3 py-1"
              }
            >
              <View className="flex-row">
                <Icon
                  name="layer-group"
                  size={13}
                  color={`white`}
                  style={{ opacity: 0.5, marginRight: 5 }}
                />
                <Text>Exercises </Text>
              </View>
              <Text className={"text-sm text-white"}>
                {workoutHistory.data?.exercises.length || "N/A"}
              </Text>
            </View>
            <View
              className={
                "flex-row items-center rounded-full bg-base-100 px-3 py-1"
              }
            >
              <View className="flex-row">
                <Icon
                  name="layer-group"
                  size={13}
                  color={`white`}
                  style={{ opacity: 0.5, marginRight: 5 }}
                />
                <Text>Sets </Text>
              </View>
              <Text className={"text-sm text-white"}>
                {workoutHistory.data?.exercises.reduce(
                  (acc, exercise) => acc + (exercise?.sets?.length || 0),
                  0,
                ) || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          scrollEnabled={false}
          data={workoutHistory.data?.exercises}
          className=""
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}-${item.exerciseId}`}
          renderItem={({ item, index }) => (
            <View className="mb-6">
              <ExerciseHistoryCard value={item} index={index} />
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() =>
            deleteWorkout.mutate({ id: params.workoutId as string })
          }
          className="h-12 items-center justify-center rounded-lg bg-red-400"
        >
          <Text className="text-lg font-semibold">Delete Workout</Text>
        </TouchableOpacity>
      </FullHeightScrollView>
    </SafeAreaView>
  );
};

export default HistoryWorkoutItem;
