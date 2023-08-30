import React from "react";
import { useOAuth, useUser, useSession } from "@clerk/clerk-expo";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { useWarmUpBrowser } from "../utils/useWarmUpBrowser";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants";

const SignInWithOAuth = () => {
  useWarmUpBrowser();
  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });

  console.log({
    user: useUser(),
    session: useSession(),
    consts: Constants.expoConfig?.extra,
  });

  const handleSignInWithPress = React.useCallback(
    async (authType: "google" | "apple") => {
      try {
        let authHandler: (typeof googleOAuth)["startOAuthFlow"];
        if (authType === "google") {
          authHandler = googleOAuth.startOAuthFlow;
        } else if (authType === "apple") {
          authHandler = appleOAuth.startOAuthFlow;
        } else {
          throw new Error(
            `invalid authType "${authType}", must be "google" or "apple"`,
          );
        }

        const { createdSessionId, setActive, authSessionResult } =
          await authHandler();
        if (authSessionResult?.type === "dismiss") {
          return;
        }
        if (createdSessionId) {
          setActive?.({ session: createdSessionId });
        } else {
          // Modify this code to use signIn or signUp to set this missing requirements you set in your dashboard.
          throw new Error(
            "There are unmet requirements, modify this else to handle them",
          );
        }
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
        console.log("error signing in", err);
      }
    },
    [],
  );

  return (
    <View>
      <Text className="p-4 text-center text-5xl font-extrabold text-white">
        Active Aces
      </Text>

      {/* <DividerWithIcon className="opacity-5">
        <UserIcon color={"white"} width={20} />
      </DividerWithIcon> */}

      <View className="mt-6 flex-row space-x-2">
        <TouchableOpacity
          onPress={() => handleSignInWithPress("google")}
          className="flex h-16 flex-1 items-center justify-center rounded-lg bg-white"
        >
          <Image
            source={require("~/assets/google.png")}
            style={{
              resizeMode: "contain",
            }}
            className="h-12 w-12"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignInWithPress("apple")}
          className="flex h-16 flex-1 items-center justify-center rounded-lg bg-white"
        >
          <Icon name="apple" size={55} color={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInWithOAuth;
