import { EstrelasProvider } from "@/context/EstrelasContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <EstrelasProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </EstrelasProvider>
  );
}
