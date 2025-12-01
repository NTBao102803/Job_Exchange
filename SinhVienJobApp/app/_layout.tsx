import { Stack } from "expo-router";
import "../global.css";


export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="changepassword" />
      <Stack.Screen name="appliedjobs" />

      {/* Candidate Tab Stack */}
      <Stack.Screen name="candidate/_layout" />
    </Stack>
  );
}
