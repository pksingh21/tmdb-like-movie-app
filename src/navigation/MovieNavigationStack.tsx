import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomePage from "../screens/Home";
import MovieAllDetails from "../screens/MovieDetailsPage";
export type MovieNavigationStackParamList = {
  HomePage: undefined;
  MovieAllDetails: { movieId: number };
};
const Stack = createNativeStackNavigator<MovieNavigationStackParamList>();

function MovieNavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="MovieAllDetails" component={MovieAllDetails} />
    </Stack.Navigator>
  );
}

export default MovieNavigationStack;
