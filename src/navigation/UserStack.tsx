import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import * as React from "react";
import {
  // Button,
  ScrollViewProps,
} from "react-native";
import { TopNav, themeColor, useTheme } from "react-native-rapi-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fromWhichScreenMovieDetails,
  isAllMoviePageOpen,
} from "../states/atom";
import LikedMovieNavigationStack, {
  LikedMovieNavigationStackParamList,
} from "./LikedMovieNavigationStack";
import MovieNavigationStack, {
  MovieNavigationStackParamList,
} from "./MovieNavigationStack";
import SearchMovieNavigationStack, {
  SearchMovieNavigationStackParamList,
} from "./SearchMovieNavigationStack";
type createDrawerNavigatorStack = {
  Home: undefined;
  FavouriteMovies: undefined;
  UserScreen: undefined;
  SearchMovies: undefined;
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
  const searchMovieNavigation =
    useNavigation<NavigationProp<SearchMovieNavigationStackParamList>>();
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
                  if (isMovieOpen) {
                    if (whichScreen === "home") {
                      setIsMovieOpen(false);
                      setWhichScreen("home");
                      stackNavigation.goBack();
                    } else if (whichScreen === "likedMovies") {
                      setIsMovieOpen(false);
                      setWhichScreen("home");
                      likedMovieStackNavigation.navigate("LikedMoviePages");
                    } else if (whichScreen === "searchMovies") {
                      setIsMovieOpen(false);
                      setWhichScreen("searchMovies");
                      searchMovieNavigation.navigate("SearchMoviePages");
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
      <Drawer.Screen
        name="SearchMovies"
        options={{
          title: "Search Movies",
        }}
        component={SearchMovieNavigationStack}
      />
    </Drawer.Navigator>
  );
}
