import { Redirect}from "expo-router";
import { useEffect, useState } from "react";

export default function AuthGate() {
  return <Redirect href="/(auth)/login" />;
}
