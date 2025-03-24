import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false}} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="menu" options={{ headerShown: true, title: "Menu" }} />
      <Stack.Screen name="foodQuery" options={{ headerShown: false, title: "Food Query" }} />
      <Stack.Screen name="favorited" options={{ headerShown: false, title: "Favorited" }} />
      <Stack.Screen name="nutritional" options={{ headerShown: false, title: "Nutritional" }} />
    </Stack>
  );
}
