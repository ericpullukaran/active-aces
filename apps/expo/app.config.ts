import { ExpoConfig, ConfigContext } from "@expo/config";

// TODO: remove this asap
const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZW1pbmVudC1saW9uZmlzaC04NS5jbGVyay5hY2NvdW50cy5kZXYk";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "Active Aces",
  slug: "active-aces",
  version: "0.0.1",
  owner: "chatgph",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#151718",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "your.bundle.identifier",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#151718",
    },
    package: "com.soorria.activeaces",
  },
  androidStatusBar: {
    barStyle: "light-content",
    backgroundColor: "#151718",
    translucent: false,
  },
  backgroundColor: "#151718",
  extra: {
    eas: {
      projectId: "13f40d9c-f52c-459d-83e6-63d220fdf221",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
  scheme: "actice-aces",
  web: {
    bundler: "metro",
  },
});

export default defineConfig;
