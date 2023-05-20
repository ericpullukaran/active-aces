import React, { useLayoutEffect } from "react";
import { PlusCircleIcon, UserIcon } from "react-native-heroicons/solid";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { trpc } from "../utils/trpc";
import { fonts } from "~/utils/fonts";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import HistoryCard from "~/components/HistoryCard";

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="mt-4 w-24 rounded-lg border-2 border-gray-500">
      <Button
        title="Sign Out"
        color={"white"}
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

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

  return (
    <SafeAreaView className="bg-base">
      <View className="h-full w-full px-4">
        <View className="flex-row justify-end">
          <View>
            <TouchableOpacity
              onPress={() => router.push("history")}
              className="flex h-16 w-16 items-center justify-center"
            >
              <Image
                source={require("../assets/logo_dark.png")}
                style={{
                  height: 150,
                  resizeMode: "contain",
                }}
                className="w-full"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-5xl leading-[55px] text-white">
          <Text className="font-extrabold text-primary">Ace</Text>, every
          {"\nworkout counts. Let's conquer today!"}
        </Text>

        <SignOut />

        <View className="mt-8 h-60 rounded-lg bg-base-100 px-3">
          <View className="m-2 h-8 flex-row items-center">
            <Text className="flex-1 text-lg font-medium text-white/50">
              Recent Workouts
            </Text>
            <Icon
              name="chevron-right"
              size={17}
              color={`white`}
              style={{ opacity: 0.5 }}
            />
          </View>
          <HistoryCard />
        </View>

        <View className="absolute bottom-9 left-0 right-0">
          <Pressable
            onPress={async () => {
              if (!currentWorkout.data) {
                await startWorkout.mutateAsync();
              }
              router.push("create_workout");
            }}
          >
            <View className="mx-auto flex flex-row items-center justify-center rounded-2xl bg-base-100 p-2  shadow-lg">
              {!currentWorkout.data ? (
                <View className="mr-1 rounded-2xl bg-primary p-4">
                  <Icon
                    name="play"
                    size={20}
                    color={`${myResolveTWConfig("base")}`}
                  />
                </View>
              ) : (
                <View className="mr-1 rounded-2xl border-2 border-primary p-4">
                  <Icon name="play" size={20} color={`white`} />
                </View>
              )}
              <Text className="ml-3 mr-4 text-lg font-medium text-white">
                {!currentWorkout.data ? "Start Workout" : "Continue"}
                {!currentWorkout.data && (
                  <>
                    <View className={"200 pl-4"}>
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
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
