import { View, Text, FlatList } from "react-native";
import React from "react";
import { trpc } from "~/utils/trpc";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fonts } from "~/utils/fonts";
import { useExercises } from "~/utils/exercises";
import { getWorkoutVolume } from "~/utils/workouts";
import commaNumber from "comma-number";
import { getDuration } from "~/utils/durationCalculations";
import HistoryCard from "~/components/HistoryCard";
// import Icon from "react-native-vector-icons/FontAwesome5";

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

  const flatWorkoutHistory =
    workoutHistoryQuery.data?.pages.flatMap((page) => page.workouts) ??
    trpcContext.workouts.history.getData({ limit: 3 })?.workouts;
  return (
    <View className="p-4">
      <FlatList
        showsVerticalScrollIndicator={false}
        className="h-full"
        data={flatWorkoutHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard workout={item} />}
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
