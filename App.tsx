import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "react-native-rapi-ui";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/provider/AuthProvider";

export default function App() {
  const images = [
    require("./assets/images/login.png"),
    require("./assets/images/register.png"),
    require("./assets/images/forget.png"),
  ];

  return (
    <ThemeProvider images={images}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </ThemeProvider>
  );
}