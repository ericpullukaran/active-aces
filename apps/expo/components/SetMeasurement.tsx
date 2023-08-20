import React, { ReactElement } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { ArchiveBoxXMarkIcon } from "react-native-heroicons/solid";
import { XCircleIcon } from "react-native-heroicons/solid";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { RouterInputs } from "~/utils/trpc";
import { Field } from "houseform";

type SetType = NonNullable<
  RouterInputs["workouts"]["end"]["exercises"][number]["sets"][number]
>;

interface SetMeasurementProps {
  num: number;
  value: SetType & { id: string };
  onChange: (set: SetType & { id: string }) => void;
  remove: (num: number) => void;
}

function SetMeasurement({ num, value, onChange, remove }: SetMeasurementProps) {
  return (
    <View className="mb-4 justify-center rounded-lg">
      <Text className="text-md mb-1 font-medium">Set {num + 1}</Text>
      <View className="flex-row items-center">
        <View className="mt-1 flex-1 flex-row  gap-4">
          <View>
            <Text className="text-lg font-extrabold">Weight</Text>
            <TextInput
              value={(value as any).weight.toString()}
              onChangeText={(weight) => onChange({ ...value, weight: +weight })}
              keyboardType="numeric"
              placeholder={"Weight"}
              className="h-8 rounded-lg border-2 border-black/70"
            />
          </View>
          <View>
            <Text className="text-lg font-extrabold">Reps</Text>
            <TextInput
              value={(value as any).numReps.toString()}
              onChangeText={(numReps) =>
                onChange({ ...value, numReps: +numReps })
              }
              keyboardType="numeric"
              placeholder={"Reps"}
              className="h-8 rounded-lg border-2 border-black/70"
            />
          </View>
        </View>
        <Pressable onPress={() => remove(num)} className="mt-3 items-center">
          <ArchiveBoxXMarkIcon
            height={30}
            width={30}
            color={myResolveTWConfig("error")}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default SetMeasurement;
