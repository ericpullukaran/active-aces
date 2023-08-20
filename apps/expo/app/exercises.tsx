import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { trpc } from "~/utils/trpc";
import Icon from "react-native-vector-icons/FontAwesome5";

function Exercises() {
  const [text, setText] = useState("");
  const sp = useSearchParams();
  const router = useRouter();

  const exercisesQuery = trpc.exercises.all.useQuery();

  return (
    <ScrollView>
      <View className="flex h-full justify-center bg-base">
        <View className="mx-4 mt-8">
          <View className="flex flex-row items-center">
            <TouchableOpacity className="ml-2" onPress={() => router.back()}>
              <Icon name="angle-double-down" size={40} color={"white"} />
            </TouchableOpacity>
            <View className="flex flex-1 items-end ">
              <View className="">
                <Text className="text-center text-5xl font-semibold text-white">
                  Exercises
                </Text>
              </View>
              <View className="">
                <Text className="text-md text-center font-normal text-white">
                  Choose Your Challenge
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="mx-4 flex-1 pt-8">
          <View className="relative flex items-center">
            <View className="mb-8 flex h-10 w-5/6 flex-row items-center rounded-full border  border-white border-opacity-10 bg-base-200">
              <TextInput
                className="h-full flex-1 rounded-full pl-4"
                onChangeText={setText}
                value={text}
                placeholder="Enter some text"
                placeholderTextColor={"white"}
              />
              <View className="relative -right-1 flex h-12 w-20 items-center justify-center rounded-full bg-primary">
                <View>
                  <Icon
                    name="search"
                    size={20}
                    color={myResolveTWConfig("base")}
                  />
                </View>
              </View>
            </View>
          </View>
          {exercisesQuery.data?.map((exercise) => (
            <Pressable
              key={exercise.id}
              onPress={() =>
                router.push({
                  pathname: sp.from as string,
                  params: {
                    selectedExerciseId: exercise.id,
                  },
                })
              }
              className="mb-4 h-24 rounded-xl bg-base-100"
            >
              <View className="flex h-full flex-row p-3">
                <View className=" mr-3 w-20 rounded-md bg-[#4D6883]"></View>
                <View>
                  <Text className="text-xl font-extrabold text-white">
                    {exercise.name}
                  </Text>
                  <Text className="text-base text-white">
                    {exercise.description}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default Exercises;
