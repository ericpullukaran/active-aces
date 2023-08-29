import React, { useEffect } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Square3Stack3DIcon,
  StopCircleIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik, FormikProps } from "formik";
import commaNumber from "comma-number";

import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { useRouter, useSearchParams } from "expo-router";
import ExerciseCard from "~/components/ExerciseCard";
import { trpc } from "~/utils/trpc";
import Timer from "~/components/Timer";
import { v4 as uuid } from "uuid";
import Icon from "react-native-vector-icons/FontAwesome5";
import { fonts } from "~/utils/fonts";
import { FullHeightScrollView } from "~/components/FullHeightScrollView";
import type { EndWorkoutInput } from "@acme/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

type Set = EndWorkoutInput["exercises"][number]["sets"][number];

function CreateWorkoutForm({
  setValues,
  values,
  setFieldValue,
  handleSubmit,
  isSubmitting,
}: FormikProps<EndWorkoutInput>) {
  const router = useRouter();
  const params = useSearchParams();

  const currentWorkout = trpc.workouts.current.useQuery();
  const deleteWorkout = trpc.workouts.delete.useMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("workoutState");
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setFieldValue("exercises", parsedData.exercises);
        }
      } catch (error) {
        // Error retrieving data
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem("workoutState", JSON.stringify(values));
      } catch (error) {
        // Error saving data
        console.error(error);
      }
    };

    storeData();
  }, [values]);

  useEffect(() => {
    if (!params.selectedExerciseId) return;
    setValues({
      exercises: [
        ...values.exercises,
        {
          tmpId: uuid(),
          exerciseId: params.selectedExerciseId as string,
          sets: [],
        },
      ],
    });
  }, [params.selectedExerciseId]);

  const extractSetCount = () => {
    return values.exercises.reduce((acc, e) => acc + e.sets.length, 0);
  };

  const extractVolume = () => {
    return commaNumber(
      values.exercises.reduce((acc, e) => {
        return (e.sets as Set[]).reduce((accSets, s) => {
          if (!s || !s.complete) return 0;
          const weight = "weight" in s ? s.weight : 0;
          const numReps = "numReps" in s ? s.numReps : 0;

          return accSets + weight * numReps;
        }, acc);
      }, 0),
    );
  };
  const trpcContext = trpc.useContext();

  return (
    // <KeyboardAvoidingView className="flex-1" behavior="padding">
    <View className="flex-1">
      <View className="mb-12 flex-auto">
        <View className="mb-6 flex-row items-center justify-between px-4">
          <View className="relative flex flex-row items-center">
            <Icon
              name="stop-circle"
              size={25}
              color={`#ef4444`} // TODO: I want to have red-500
            />
            <Text
              className="relative -bottom-1 ml-3 text-4xl font-bold text-white"
              style={{
                fontFamily: fonts.inter.medium,
              }}
            >
              Activity
            </Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                if (currentWorkout.data) {
                  deleteWorkout.mutate(
                    { id: currentWorkout.data.id },
                    {
                      onSuccess: () => {
                        router.push("/");
                        // Clear local storage after workout cancelled
                        AsyncStorage.setItem("workoutState", "");
                        trpcContext.workouts.current.invalidate();
                      },
                    },
                  );
                }
              }}
              className="flex h-16 w-16 items-center justify-center"
            >
              <Icon
                name="trash"
                size={25}
                color={`grey`} // TODO: I want to have red-500
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-initial">
          <View className="mx-auto flex flex-row justify-between rounded-xl bg-base-100">
            <View className="flex items-center p-4">
              <View className="flex flex-row items-center">
                <StopCircleIcon size={20} color={myResolveTWConfig("error")} />
                <Text className="ml-1 text-lg text-white">Duration</Text>
              </View>
              {currentWorkout.data ? (
                <Timer
                  fromTime={currentWorkout.data.startTime}
                  classes="ml-2 text-2xl font-extrabold text-white "
                />
              ) : (
                <Text className="ml-2 text-2xl font-extrabold text-white">
                  00:00
                </Text> // TODO: why does this not show up
              )}
            </View>
            <View className="w-[1px] bg-white opacity-10" />

            <View className="flex items-center p-4">
              <View className="flex flex-row items-center">
                <Square3Stack3DIcon
                  size={20}
                  color={myResolveTWConfig("primary-content")}
                />
                <Text className="ml-1 text-lg text-white">Sets</Text>
              </View>
              <Text className="text-2xl font-extrabold text-white">
                {extractSetCount()}
              </Text>
            </View>

            <View className="w-[1px] bg-white opacity-10" />

            <View className="flex items-center p-4">
              <View className="flex flex-row items-center">
                <Icon
                  name="dice-d20"
                  size={17}
                  color={myResolveTWConfig("primary-content")}
                />
                <Text className="ml-1 text-lg text-white">Volume</Text>
              </View>
              <Text className="text-2xl font-extrabold text-white">
                {extractVolume()}kg
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-4 pb-5 pt-8">
          <Text className="mb-4 text-xl font-bold text-white">Exercises</Text>
          {values.exercises.length === 0 && (
            <View className="h-24 w-full items-center justify-center rounded-lg border border-dashed border-white/50">
              <Text className="text-md font-semibold text-white">
                No exercises 😔
              </Text>
            </View>
          )}
          <KeyboardAwareFlatList
            scrollEnabled={true}
            data={values.exercises}
            className=""
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}-${item.exerciseId}`}
            renderItem={({ item, index }) => (
              <View className="mb-6">
                <ExerciseCard
                  value={item}
                  index={index}
                  onChange={(value) =>
                    setFieldValue(`exercises[${index}]`, value)
                  }
                />
              </View>
            )}
          />
        </View>
      </View>

      <View className="absolute bottom-0 w-full flex-row px-4 pb-2">
        <TouchableOpacity
          onPress={() => handleSubmit()}
          className="mr-4 h-12 flex-1 items-center justify-center rounded-lg bg-red-400"
        >
          <Text className="text-lg font-semibold">End Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/exercises",
              params: {
                from: "/create_workout",
              },
            })
          }
          className="flex-1 flex-row items-center justify-center rounded-lg border-2 border-dashed border-white/50"
        >
          <Text className="text-lg font-semibold text-white">Add Exercise</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </KeyboardAvoidingView>
  );
}
function CreateWorkout() {
  const router = useRouter();

  const trpcContext = trpc.useContext();
  const endWorkout = trpc.workouts.end.useMutation({
    onSuccess: async () => {
      await Promise.all([
        trpcContext.workouts.invalidate(),
        trpcContext.workouts.history.refetch(),
      ]);
      router.push("/");
    },
  });

  return (
    <SafeAreaView className="h-full justify-center bg-base">
      <Formik
        initialValues={{ exercises: [] } as EndWorkoutInput}
        onSubmit={(values) => {
          const returnList = values.exercises;
          // Clear local storage after workout ended
          AsyncStorage.setItem("workoutState", "");
          console.log(JSON.stringify({ returnList }, null, 2));
          endWorkout.mutate({ exercises: returnList });
        }}
        component={CreateWorkoutForm}
      />
    </SafeAreaView>
  );
}

export default CreateWorkout;
