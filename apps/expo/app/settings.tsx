import { useAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "~/utils/fonts";

type Props = {};

export default function Settings({}: Props) {
  const { signOut } = useAuth();

  return (
    <SafeAreaView>
      <Text
        className="ml-4 mt-3 text-4xl font-bold text-white"
        style={{
          fontFamily: fonts.inter.semiBold,
        }}
      >
        Settings
      </Text>
      <View className="mx-3">
        <View className="mt-4 rounded-lg border-2 border-gray-500">
          <Button
            title="Sign Out"
            color={"white"}
            onPress={() => {
              signOut();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
