import { View, Text, FlatList } from "react-native";
import React from "react";
import { trpc } from "~/utils/trpc";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fonts } from "~/utils/fonts";
import { useExercises } from "~/utils/exercises";
import { getWorkoutVolume } from "~/utils/workouts";
import commaNumber from "comma-number";
// import Icon from "react-native-vector-icons/FontAwesome5";

const getDuration = (startTime: Date, endTime: Date) => {
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

const History = () => {
  const trpcContext = trpc.useContext();
  const workoutHistoryQuery = trpc.workouts.history.useInfiniteQuery(
    { limit: 20 },
    {
      onSuccess: (data) => {
        data.pages.forEach((page) => {
          page.workouts.map((d) => {
            trpcContext.workouts.get.setData(
              {
                id: d.id,
              },
              d,
            );
          });
        });
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnMount: true,
    },
  );

  const exercises = useExercises();

  const flatWorkoutHistory = workoutHistoryQuery.data?.pages.flatMap(
    (page) => page.workouts,
  );

  const router = useRouter();
  return (
    <View className="p-4">
      <FlatList
        className="h-full"
        data={flatWorkoutHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-8 rounded-lg bg-gray-800 p-4"
            onPress={() => {
              router.push(
                item.endTime ? `/history/${item.id}` : `/create_workout`,
              );
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

            <View className="mb-4">
              {item.exercises.map((exercise) => (
                <View key={exercise.id}>
                  <Text
                    className="text-sm text-gray-300"
                    style={{ fontFamily: fonts.inter.medium }}
                  >
                    {exercises.dataAsMap?.[exercise.exerciseId]?.name ?? "..."}{" "}
                    - {exercise.sets.length} sets
                  </Text>
                </View>
              ))}

              {item.exercises.length === 0 && (
                <Text className="text-sm text-gray-300">No exercises 😔</Text>
              )}
            </View>

            <View className="flex-row space-x-4">
              <View>
                <Text className="text-xs text-gray-500">Duration</Text>
                <Text className="text-sm text-gray-300">
                  {item.endTime
                    ? getDuration(item.startTime, item.endTime)
                    : "-"}
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
        )}
        onEndReached={() => {
          workoutHistoryQuery.fetchNextPage();
        }}
        refreshing={workoutHistoryQuery.isRefetching}
        onRefresh={() => {
          workoutHistoryQuery.refetch();
        }}
      />
    </View>
  );
};

export default History;
