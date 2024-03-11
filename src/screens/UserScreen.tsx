import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Layout,
  Text,
  TopNav,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";

export default function () {
  const { isDarkmode, setTheme } = useTheme();
  const navigation = useNavigation();
  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDarkmode ? themeColor.dark : themeColor.white100,
        }}
      >
        <Text fontWeight="bold">This will be user screen</Text>
      </View>
    </Layout>
  );
}
