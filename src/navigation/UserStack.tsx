import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Button,
  // Button,
  ScrollViewProps,
  View,
} from "react-native";
import { TopNav, themeColor, useTheme } from "react-native-rapi-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import UserScreen from "../screens/UserScreen";
import MovieNavigationStack, {
  MovieNavigationStackParamList,
} from "./MovieNavigationStack";
import {
  fromWhichScreenMovieDetails,
  isAllMoviePageOpen,
} from "../states/atom";
import { useAtom } from "jotai";
import LikedMoviePages from "../screens/LikedMoviePages";
import LikedMovieNavigationStack, {
  LikedMovieNavigationStackParamList,
} from "./LikedMovieNavigationStack";
type createDrawerNavigatorStack = {
  Home: undefined;
  FavouriteMovies: undefined;
  UserScreen: undefined;
};
const Drawer = createDrawerNavigator<createDrawerNavigatorStack>();
type Props = ScrollViewProps & {
  children: React.ReactNode;
};

export default function UserStack() {
  const { isDarkmode, setTheme } = useTheme();
  const [isMovieOpen, setIsMovieOpen] = useAtom(isAllMoviePageOpen);
  const [whichScreen, setWhichScreen] = useAtom(fromWhichScreenMovieDetails);
  const stackNavigation =
    useNavigation<NavigationProp<MovieNavigationStackParamList>>();
  const likedMovieStackNavigation =
    useNavigation<NavigationProp<LikedMovieNavigationStackParamList>>();
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveBackgroundColor: isDarkmode
          ? themeColor.white100
          : undefined,
        drawerActiveTintColor: isDarkmode ? themeColor.dark : undefined,
        drawerInactiveTintColor: isDarkmode ? themeColor.white100 : undefined,
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: isDarkmode ? themeColor.dark : undefined,
        },
        header: ({ navigation, route, options }) => {
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : route.name;

          return (
            <SafeAreaView style={{ backgroundColor: "", marginBottom: -50 }}>
              <TopNav
                middleContent={title.toString()}
                rightContent={
                  <Ionicons
                    name={isDarkmode ? "sunny" : "moon"}
                    size={20}
                    color={isDarkmode ? themeColor.white100 : themeColor.dark}
                  />
                }
                leftContent={
                  <Ionicons
                    name={!isMovieOpen ? "options" : "arrow-back"}
                    size={20}
                    color={isDarkmode ? themeColor.white100 : themeColor.dark}
                  />
                }
                rightAction={() => {
                  if (isDarkmode) {
                    setTheme("light");
                  } else {
                    setTheme("dark");
                  }
                }}
                leftAction={() => {
                  console.log(whichScreen);
                  if (isMovieOpen) {
                    if (whichScreen === "home") {
                      setIsMovieOpen(false);
                      setWhichScreen("home");
                      stackNavigation.goBack();
                    } else if (whichScreen === "likedMovies") {
                      console.log(" alright in liked movies");
                      setIsMovieOpen(false);
                      setWhichScreen("home");
                      likedMovieStackNavigation.navigate("LikedMoviePages");
                    }
                  } else {
                    navigation.openDrawer();
                  }
                }}
              />
            </SafeAreaView>
          );
        },
      }}
    >
      <Drawer.Screen name="Home" component={MovieNavigationStack} />
      <Drawer.Screen
        name="FavouriteMovies"
        options={{
          title: "Favourite Movies",
        }}
        component={LikedMovieNavigationStack}
      />
    </Drawer.Navigator>
  );
}
