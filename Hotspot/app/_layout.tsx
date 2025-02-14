import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="menu" options={{ headerShown: true, title: "Menu" }} />
    </Stack>
  );
}
