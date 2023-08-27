import React from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignInWithOAuth from "~/components/SignInWithOAuth";

export const SignInSignUpScreen = () => {
  return (
    <View>
      <SafeAreaView className="flex h-screen justify-center bg-base">
        <View className="mx-8 mb-8">
          <View>
            <Image
              source={require("../assets/logo_dark.png")}
              style={{
                height: 150,
                resizeMode: "contain",
              }}
              className="w-full"
            />
          </View>
        </View>
        <View className="p-4">
          <SignInWithOAuth />
        </View>
      </SafeAreaView>
    </View>
  );
};
