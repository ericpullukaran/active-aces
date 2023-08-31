import { ExpoConfig, ConfigContext } from "@expo/config";

// TODO: remove this asap
const CLERK_PUBLISHABLE_KEY =
  "pk_test_ZW1pbmVudC1saW9uZmlzaC04NS5jbGVyay5hY2NvdW50cy5kZXYk";

const defineConfig = (_ctx: ConfigContext): ExpoConfig => ({
  name: "expo",
  slug: "expo",
  version: "1.0.0",
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
  },
  androidStatusBar: {
    barStyle: "light-content",
    backgroundColor: "#151718",
    translucent: false,
  },
  backgroundColor: "#151718",
  extra: {
    eas: {
      projectId: "your-project-id",
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
