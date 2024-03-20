import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "react-native-rapi-ui";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/provider/AuthProvider";
import { Provider } from "react-redux";
import { store } from "./src/states/store";
export default function App() {
  const images = [
    require("./assets/images/login.png"),
    require("./assets/images/register.png"),
    require("./assets/images/forget.png"),
  ];

  return (
    <ThemeProvider images={images}>
      <Provider store={store}>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}
