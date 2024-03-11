import React, { useContext, useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";

import { NavigationContainer } from "@react-navigation/native";
import { useTheme } from "react-native-rapi-ui";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./MainStack";
import Auth from "./AuthStack";
import Loading from "../screens/utils/Loading";
import { StatusBar } from "expo-status-bar";
const NativeStack = createNativeStackNavigator();
export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;
  const { isDarkmode } = useTheme();
  useEffect(() => {}, [auth]);
  return (
    <NavigationContainer>
      <NativeStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <NativeStack.Screen
          name="Main"
          component={
            user === null
              ? Loading
              : user === undefined || user === false
              ? Auth
              : Main
          }
        />
      </NativeStack.Navigator>
      <StatusBar
        backgroundColor={isDarkmode ? "black" : "white"}
        style={isDarkmode ? "light" : "dark"}
      />
    </NavigationContainer>
  );
};
