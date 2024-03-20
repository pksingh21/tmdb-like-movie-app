import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import MovieAllDetails from "../screens/MovieDetailsPage";
import SearchMovies from "../screens/SearchMovies";
export type SearchMovieNavigationStackParamList = {
  SearchMoviePages: undefined;
  MovieAllDetailsFromSearchMoviePages: { movieId: number };
};
const Stack = createNativeStackNavigator<SearchMovieNavigationStackParamList>();

function SearchMovieNavigationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SearchMoviePages" component={SearchMovies} />
      <Stack.Screen
        name="MovieAllDetailsFromSearchMoviePages"
        component={MovieAllDetails}
      />
    </Stack.Navigator>
  );
}

export default SearchMovieNavigationStack;
