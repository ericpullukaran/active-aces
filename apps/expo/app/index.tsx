import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { trpc } from "../utils/trpc";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { getFallbackWorkoutName } from "~/utils/workouts";
import HistoryCard from "~/components/HistoryCard";

const HomeScreen = () => {
  trpc.exercises.all.useQuery();
  const trpcContext = trpc.useContext();
  const router = useRouter();
  const userQuery = trpc.user.current.useQuery(); // XX FFFS THIS IS NOT WORKING
  const currentWorkout = trpc.workouts.current.useQuery();
  const startWorkout = trpc.workouts.start.useMutation({
    onSuccess: () => {
      trpcContext.workouts.invalidate();
    },
  });
  const recentWorkoutsQuery = trpc.workouts.history.useQuery(
    { limit: 3 },
    {
      refetchOnMount: true,
    },
  );

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView className="bg-base">
          <View className="h-full w-full px-4">
            <View className="mb-8 h-16 flex-row items-center justify-start rounded-xl bg-base-100">
              <View className="m-2 ml-4 flex-1 flex-row items-center">
                <View className="flex h-11 w-11 items-center justify-center">
                  <Image
                    source={require("../assets/logo_dark.png")}
                    style={{
                      height: 150,
                      resizeMode: "contain",
                    }}
                    className="w-full"
                  />
                </View>
                <Text className="ml-4 text-2xl font-bold text-zinc-500">
                  Active Aces
                </Text>
              </View>
              <TouchableOpacity
                className="m-2 mr-4"
                onPress={() => router.push("settings")}
              >
                <Icon name="cog" size={25} color="grey" />
              </TouchableOpacity>
            </View>
            <Text className="text-5xl leading-[55px] text-white">
              <Text className="font-extrabold text-primary">Ace</Text>, every
              {"\nworkout counts. Let's conquer today!"}
            </Text>

            <View className="mt-8 rounded-lg pb-3">
              <View className="mb-4 h-8 flex-row items-center">
                <Text className="flex-1 text-lg font-medium text-white/50">
                  Recent Workouts
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("history")}
                  className="h-full flex-row items-center space-x-2 rounded-xl bg-base-200 px-3"
                >
                  <Text className="-translate-y-0.5 text-lg font-medium text-white/50">
                    more
                  </Text>

                  <View>
                    <Icon
                      name="chevron-right"
                      size={13}
                      color={`white`}
                      style={{ opacity: 0.5 }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                className="mb-12"
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                data={recentWorkoutsQuery.data?.workouts}
                renderItem={({ item }) => <HistoryCard workout={item} />}
              />
              {/* {recentWorkoutsQuery.data && (
            <HistoryCard workout={recentWorkoutsQuery.data.workouts[0]} />
          )} */}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <View className="absolute bottom-9 left-0 right-0 shadow-lg">
        <Pressable
          onPress={async () => {
            if (startWorkout.isLoading) return;

            if (!currentWorkout.data) {
              await startWorkout.mutateAsync({
                name: getFallbackWorkoutName(),
              });
            }
            router.push("create_workout");
          }}
        >
          <View className="mx-auto flex flex-row items-center justify-center rounded-2xl border-2 border-green-400 bg-base-100 p-3 shadow-lg">
            {!currentWorkout.data ? (
              <View
                className="mr-1 flex items-center justify-center rounded-2xl bg-primary"
                style={{ width: 52, height: 52 }}
              >
                <Icon
                  name="play"
                  size={20}
                  color={`${myResolveTWConfig("base")}`}
                />
              </View>
            ) : (
              <View className="mr-1 rounded-2xl border-2 border-primary p-4">
                <Icon name="play" size={20} color="white" />
              </View>
            )}
            <Text className="ml-3 mr-4 text-lg font-medium text-white">
              {!currentWorkout.data ? "Start Workout" : "Continue"}
            </Text>
            {!currentWorkout.data && (
              <>
                <View className={"200"}>
                  <Icon name="chevron-right" size={20} color={`white`} />
                </View>
                <View className={"200 pl-1 opacity-20"}>
                  <Icon name="chevron-right" size={20} color={`white`} />
                </View>
                <View className={"200 pl-1 opacity-5"}>
                  <Icon name="chevron-right" size={20} color={`white`} />
                </View>
              </>
            )}
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default HomeScreen;
