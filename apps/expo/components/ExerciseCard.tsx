import React, { useRef } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { RouterInputs, trpc } from "~/utils/trpc";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { useExercises } from "~/utils/exercises";

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

const SET_MEASUREMENT_TYPES = [
  "weight",
  "numReps",
  "time",
  "distance",
] as const;
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

export type EndWorkoutExercises = {
  exerciseId: string;
  tmpId: string;
  notes?: string | undefined;
  sets: RouterInputs["workouts"]["end"]["exercises"][number]["sets"];
};

function ExerciseCard({
  value: exerciseInfo,
  index: exerciseIndex,
  onChange,
}: {
  value: EndWorkoutExercises;
  index: number;
  onChange: (value: EndWorkoutExercises) => void;
}) {
  const PrevRef = useRef(null);
  const exercises = useExercises();
  const curExercise = exercises.dataAsMap?.[exerciseInfo.exerciseId];
  const curMesType =
    curExercise?.measurementType as keyof typeof emptySetsByMeasurementType;

  const getHeaders = () => {
    if (curMesType === "weight-reps") {
      return (
        <>
          <Text className="w-14 text-sm font-medium text-white/30">Weight</Text>
          <Text className="w-14 text-sm font-medium text-white/30">Reps</Text>
        </>
      );
    } else if (curMesType === "time-distance") {
      return (
        <>
          <Text className="w-14 overflow-hidden text-sm font-medium text-white/30">
            Time
          </Text>
          <Text className="w-14 overflow-hidden text-sm font-medium text-white/30">
            Dist.
          </Text>
        </>
      );
    } else if (curMesType === "time") {
      return (
        <Text className="w-14 text-sm font-medium text-white/30">Time</Text>
      );
    } else if (curMesType === "reps") {
      return (
        <Text className="w-14 text-sm font-medium text-white/30">Reps</Text>
      );
    }
  };

  const getCompletedSets = () =>
    (exerciseInfo.sets as any[]).reduce(
      (acc, s) => acc + (s.complete ? 1 : 0),
      0,
    );

  function renderRightActions(onPress: () => void, index: number) {
    return (
      <Pressable
        onPress={onPress}
        className={`h-14 items-center justify-center ${
          index === exerciseInfo.sets.length - 1 ? " rounded-br-lg " : ""
        } bg-red-500 px-6`}
      >
        <Icon name="trash" size={24} color="white" />
      </Pressable>
    );
  }

  return (
    <View className="">
      <View className="mb-8">
        <View
          className="h-22 z-20 flex-row items-start rounded-xl bg-[#202224] p-3"
          style={styles.shadow}
        >
          <View className="mr-2 h-16 w-20 rounded-md bg-red-300"></View>
          <View className="flex-1">
            <Text className="font-extrabold text-base text-white">
              {curExercise?.name}
            </Text>
            <Text className="text-xs text-white">
              {curExercise?.description}
            </Text>
          </View>
          <View className="mr-2 self-center">
            <Text className="text-white">
              {getCompletedSets() !== exerciseInfo.sets.length ? (
                <>
                  {getCompletedSets()}/{exerciseInfo.sets.length}
                </>
              ) : (
                <Icon
                  name="check-circle"
                  solid={true}
                  size={20}
                  color={`${myResolveTWConfig("success")}`} // TODO: I want to have red-500
                />
              )}
            </Text>
          </View>
        </View>
        <View
          className={`absolute top-16 z-10 w-full ${
            exerciseInfo.sets.length === 0 ? "" : "bg-base-100"
          }`}
        >
          <View className="bg-base-300  h-14 w-full flex-row items-end justify-between rounded-xl bg-base-200 px-6 pb-1 ">
            <Text className="w-14 text-sm font-medium text-white/30">
              Prev.
            </Text>
            {getHeaders()}
            <Text className="w-12 text-sm font-medium text-white/30">
              Status
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full rounded-xl">
        <View>
          {(exerciseInfo.sets as any[]).map((set: any, index) => (
            <Swipeable
              key={index}
              renderRightActions={() =>
                renderRightActions(() => {
                  const newArray = [...exerciseInfo.sets];
                  newArray.splice(index, 1);
                  onChange({ ...exerciseInfo, sets: [...newArray] as any });
                }, index)
              }
            >
              <View
                className={`h-14 flex-row items-center justify-between ${
                  index % 2 === 0 ? "bg-base-100" : "bg-base-200"
                } ${
                  index === exerciseInfo.sets.length - 1 ? " rounded-b-xl " : ""
                } px-6`}
              >
                <Text
                  ref={PrevRef}
                  className="w-14 whitespace-pre text-sm text-white opacity-40"
                >
                  10kgx91
                </Text>
                {requiredFields[curMesType].map((measurement_type) => (
                  <TextInput
                    key={`${exerciseInfo.exerciseId}-${measurement_type}`}
                    aria-disabled={true}
                    className={`h-4/6 w-14 rounded-lg border ${
                      set.complete ? "bg-base-200" : "bg-base"
                    } pl-2 text-white`}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      onChange({
                        ...exerciseInfo,
                        sets: (exerciseInfo.sets as any[]).map((s, idx) => {
                          if (idx === index) {
                            return {
                              ...s,
                              [measurement_type]: Number(text),
                            };
                          } else {
                            return s;
                          }
                        }),
                      });
                    }}
                    editable={!set.complete}
                    value={set[measurement_type].toString()}
                    // onBlur={handleBlur(`sets[${index}].measurement_type`)}
                  />
                ))}

                <View className="w-12">
                  <Pressable
                    onPress={() => {
                      onChange({
                        ...exerciseInfo,
                        sets: (exerciseInfo.sets as any[]).map((s, idx) => {
                          if (idx === index) {
                            return { ...s, complete: !s.complete };
                          } else {
                            return s;
                          }
                        }),
                      });
                    }}
                    className={`h-7 w-7 items-center justify-center rounded-lg ${
                      set.complete ? "bg-success" : "border border-white"
                    }`}
                  >
                    <Icon
                      name="check"
                      size={12}
                      color={`${set.complete ? "black" : "white"}`} // TODO: I want to have red-500
                    />
                  </Pressable>
                </View>
              </View>
            </Swipeable>
          ))}
        </View>
      </View>
      <Pressable
        onPress={() => {
          if (!curMesType) {
            return;
          }

          onChange({
            ...exerciseInfo,
            sets: [
              ...(exerciseInfo.sets as any[]),
              emptySetsByMeasurementType[curMesType],
            ],
          });
        }}
        className="mt-2 h-8 items-center justify-center rounded-lg bg-base-100"
      >
        <Text className="text-md font-medium text-white">Add Set</Text>
      </Pressable>
    </View>
  );
}

export default ExerciseCard;
