import React, { useEffect } from "react";
import { FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";
import {
  Square3Stack3DIcon,
  StopCircleIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik, FormikProps } from "formik";

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

type Set = EndWorkoutInput["exercises"][number]["sets"][number];

function CreateWorkoutForm({
  setValues,
  values,
  setFieldValue,
  handleSubmit,
}: FormikProps<EndWorkoutInput>) {
  const router = useRouter();
  const params = useSearchParams();

  const currentWorkout = trpc.workouts.current.useQuery();

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
    return values.exercises.reduce((acc, e) => {
      return (e.sets as Set[]).reduce((accSets, s) => {
        if (!s || !s.complete) return 0;
        const weight = "weight" in s ? s.weight : 0;
        const numReps = "numReps" in s ? s.numReps : 0;

        return accSets + weight * numReps;
      }, acc);
    }, 0);
  };

  return (
    <FullHeightScrollView onScrollBeginDrag={() => Keyboard.dismiss()}>
      <View className="flex-1">
        <View className="mb-12">
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
              <TouchableOpacity className="flex h-16 w-16 items-center justify-center">
                <Icon
                  name="cog"
                  size={25}
                  color={`grey`} // TODO: I want to have red-500
                />
              </TouchableOpacity>
            </View>
          </View>

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

          <View className="static mx-4 pt-8">
            <Text className="mb-4 text-xl font-bold text-white">Exercises</Text>
            {values.exercises.length === 0 && (
              <View className="h-24 w-full items-center justify-center rounded-lg border border-dashed border-white/50">
                <Text className="text-md font-semibold text-white">
                  No exercises 😔
                </Text>
              </View>
            )}
            <View>
              <FlatList
                scrollEnabled={false}
                data={values.exercises}
                keyExtractor={(item, index) => `${index}-${item.exerciseId}`}
                renderItem={({ item, index }) => (
                  <View className="mb-10">
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
        </View>

        <View className="absolute bottom-0 w-full flex-row px-4 pb-4">
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
            <Text className="text-lg font-semibold text-white">
              Add Exercise
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </FullHeightScrollView>
  );
}
function CreateWorkout() {
  const router = useRouter();

  const endWorkout = trpc.workouts.end.useMutation();
  const trpcContext = trpc.useContext();

  return (
    <SafeAreaView className="h-full justify-center bg-base">
      <Formik
        initialValues={{ exercises: [] } as EndWorkoutInput}
        onSubmit={(values) => {
          const returnList = values.exercises.map((e) => ({
            ...e,
            sets: e.sets.map((s) => {
              const { complete, ...otherKeys } = s;
              return {
                ...otherKeys,
                weight: "weight" in otherKeys ? otherKeys.weight : 0,
                numReps: "numReps" in otherKeys ? otherKeys.numReps : 0,
                time: "time" in otherKeys ? otherKeys.time : 0,
                distance: "distance" in otherKeys ? otherKeys.distance : 0,
              };
            }),
          }));

          endWorkout.mutate(
            { exercises: returnList },
            {
              onSuccess: () => {
                trpcContext.workouts.invalidate();
                router.push("/");
              },
            },
          );
        }}
        component={CreateWorkoutForm}
      />
    </SafeAreaView>
  );
}

export default CreateWorkout;
