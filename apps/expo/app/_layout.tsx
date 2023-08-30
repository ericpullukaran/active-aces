import { TRPCProvider } from "~/utils/trpc";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { SignInSignUpScreen } from "./signin";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "~/utils/cache";
import Constants from "expo-constants";
import { SplashScreen, Stack } from "expo-router";
import { fonts, useFonts } from "~/utils/fonts";
import React, { useEffect } from "react";
import { setCustomText } from "react-native-global-props";
import { myResolveTWConfig } from "~/utils/myResolveTWConfig";

export const unstable_settings = {
  initialRouteName: "index",
};

const Layout: React.FC = () => {
  const [fontsLoaded] = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      setCustomText({
        style: {
          color: "white",
          fontFamily: fonts.inter.regular,
        },
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <ClerkProvider
      publishableKey={
        "pk_test_ZW1pbmVudC1saW9uZmlzaC04NS5jbGVyay5hY2NvdW50cy5kZXYk" ??
        Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY
      }
      tokenCache={tokenCache}
    >
      <SignedIn>
        <TRPCProvider>
          <SafeAreaProvider>
            {/* * To be able to see the status bar on android */}
            <StatusBar style="dark" />
            {/* ! Don't put any elements around the <Stack /> here. You might lose several hours of your life */}
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: myResolveTWConfig("base"),
                },
                headerStyle: {
                  backgroundColor: myResolveTWConfig("base"),
                },
                headerTitleStyle: {
                  color: "white",
                },
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  animation: "fade",
                }}
              />
              <Stack.Screen
                name="create_workout"
                options={{
                  // Set the presentation mode to modal for our modal route.
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="exercises"
                options={{
                  // Set the presentation mode to modal for our modal route.
                  presentation: "modal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
            <StatusBar style="dark" />
          </SafeAreaProvider>
        </TRPCProvider>
      </SignedIn>
      <SignedOut>
        <SignInSignUpScreen />
      </SignedOut>
    </ClerkProvider>
  );
};

export default Layout;
