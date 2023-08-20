import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter, useSearchParams } from "expo-router";
import { trpc } from "~/utils/trpc";

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
      router.push("/history");
    },
  });

  return (
    <View>
      <Text>HistoryWorkoutItem</Text>
      <Text>{workoutHistory.data?.name}</Text>

      <Button
        title="yeetus deletus"
        disabled={deleteWorkout.isLoading}
        onPress={() => deleteWorkout.mutate({ id: params.workoutId as string })}
      />
    </View>
  );
};

export default HistoryWorkoutItem;
