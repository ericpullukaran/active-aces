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
}: {
  exerciseInfo: EndWorkoutExercises;
  name: string;
  description: string;
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
          className="h-22  flex-row items-start rounded-xl bg-[#202224] p-3"
          style={styles.shadow}
        >
          {/* Existing content */}
          <View className="mr-2 h-16 w-20 rounded-md bg-red-300"></View>
          <View className="flex-1">
            <Text className="font-extrabold text-base text-white">{name}</Text>
            <Text className="text-xs text-white">{description}</Text>
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
                  color={`${myResolveTWConfig("success")}`}
                />
              )}
            </Text>
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
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          activeOpacity={1} // Keep it fully opaque
          onPressOut={() => setModalVisible(false)} // Close when pressed
        >
          {/* Modal Content */}
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                elevation: 5,
              }}
            >
              <Text>Menu Options Here</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-black">Close Menu</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
