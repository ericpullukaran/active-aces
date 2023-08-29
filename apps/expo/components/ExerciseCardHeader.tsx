import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";
import { EndWorkoutExercises } from "./ExerciseCard";
import * as Haptics from "expo-haptics";

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

export default function ExerciseCardHeader({
  exerciseInfo,
  name,
  description,
  onChange,
}: {
  exerciseInfo: EndWorkoutExercises;
  name: string;
  description: string;
  onChange: (value: EndWorkoutExercises | null) => void;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const getCompletedSets = () => {
    return (exerciseInfo.sets as any[]).reduce(
      (acc, s) => acc + (s.complete ? 1 : 0),
      0,
    );
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  return (
    <>
      <Pressable
        className="z-20"
        onLongPress={handleLongPress}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            height: 200,
          },
          styles.shadow,
        ]}
      >
        <View
          className="flex-row items-start rounded-xl bg-[#202224] p-3"
          style={styles.shadow}
        >
          {/* Existing content */}
          <View className="mr-2 h-16 w-20 rounded-md bg-red-300"></View>
          <View className="flex-1">
            <Text className="font-extrabold text-base text-white">{name}</Text>
            <Text className="text-xs text-white">{description}</Text>
          </View>
          <View className="mr-2 h-16 justify-between">
            <Pressable onPress={handleLongPress}>
              <Icon name="ellipsis-h" solid={true} size={20} color={`white`} />
            </Pressable>
            <View className="pb-2">
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
                    color={`${myResolveTWConfig("success")}`}
                  />
                )}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Full screen touchable area */}
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40"
          activeOpacity={1} // Keep it fully opaque
          onPressOut={() => setModalVisible(false)} // Close when pressed
        >
          {/* Modal Content */}
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View className="elevation-5 items-center rounded-xl bg-base-200 pt-6 shadow-xl">
              <View className="flex w-full flex-row justify-center border-b-2 border-t-2 border-base-100">
                <TouchableOpacity
                  onPress={() => onChange(null)}
                  className="flex h-12 w-full items-center justify-center rounded-lg px-4"
                >
                  <Text className="text-lg font-semibold text-white">
                    Remove Exercise
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-full px-4">
                <TouchableOpacity
                  className="mb-8 mt-4 h-12 w-full items-center justify-center rounded-xl bg-red-400 px-4"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-lg font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
