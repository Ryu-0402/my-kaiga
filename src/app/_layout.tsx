import "../../global.css";
import { Stack, Redirect} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AccountProvider } from "../providers/AccountProvider";

export default function RootLayout() {
  useEffect(() => {
    console.log("RootLayout mounted");
  }, []);
  return (
    <AccountProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
    </AccountProvider>
  );
}

