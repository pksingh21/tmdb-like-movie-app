import React from "react";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import SecondScreen from "../screens/UserScreen";
import MainTabs from "./MainTabs";
import UserStack from "./UserStack";
type MainStackParamList = {
  MainTabs: undefined;
  SecondScreen: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={UserStack} />
    </MainStack.Navigator>
  );
};

export default Main;
