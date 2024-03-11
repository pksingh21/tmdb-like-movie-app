import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomePage from "../screens/Home";
import MovieAllDetails from "../screens/MovieDetailsPage";
import LikedMoviePages from "../screens/LikedMoviePages";
export type LikedMovieNavigationStackParamList = {
  LikedMoviePages: undefined;
  MovieAllDetailsFromLikedMoviePages: { movieId: number };
};
const Stack = createNativeStackNavigator<LikedMovieNavigationStackParamList>();

function LikedMovieNavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="LikedMoviePages" component={LikedMoviePages} />
      <Stack.Screen
        name="MovieAllDetailsFromLikedMoviePages"
        component={MovieAllDetails}
      />
    </Stack.Navigator>
  );
}

export default LikedMovieNavigationStack;
