import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import React, { memo } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { Section, SectionImage, Text } from "react-native-rapi-ui";
import { MovieNavigationStackParamList } from "../navigation/MovieNavigationStack";
import {
  fromWhichScreenMovieDetails,
  isAllMoviePageOpen,
} from "../states/atom";
import { MovieDbResponse } from "./Home";
import { LikedMovieNavigationStackParamList } from "../navigation/LikedMovieNavigationStack";
import { SearchMovieNavigationStackParamList } from "../navigation/SearchMovieNavigationStack";
interface MovieImageCardProps {
  movieInformation: MovieDbResponse ;
  from: "liked" | "home" | "search";
}
function MovieImageCardWithDetails(props: MovieImageCardProps) {
  const [isAllMovieOpen, setIsAllMovieOpen] = useAtom(isAllMoviePageOpen);
  const [fromWhichScreen, setWhichScreen] = useAtom(
    fromWhichScreenMovieDetails
  );
  const navigation =
    useNavigation<NavigationProp<MovieNavigationStackParamList>>();
  const anotherNavigation =
    useNavigation<NavigationProp<LikedMovieNavigationStackParamList>>();
  const searchMovieNavigation =
    useNavigation<NavigationProp<SearchMovieNavigationStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => {
        setIsAllMovieOpen(true);
        if (props.from === "home") {
          setWhichScreen("home");
          navigation.navigate("MovieAllDetails", {
            movieId: props.movieInformation.movie_id,
          });
        } else if (props.from === "liked") {
          setWhichScreen("likedMovies");
          anotherNavigation.navigate("MovieAllDetailsFromLikedMoviePages", {
            movieId: props.movieInformation.movie_id,
          });
        } else if (props.from === "search") {
          setWhichScreen("searchMovies");
          searchMovieNavigation.navigate(
            "MovieAllDetailsFromSearchMoviePages",
            {
              movieId: props.movieInformation.movie_id,
            }
          );
        }
      }}
    >
      <Section>
        <ImageBackground
          source={{
            uri: `http://image.tmdb.org/t/p/w500/${props.movieInformation.movies?.backdrop_path}`,
          }}
          style={{
            width: 280,
            flex: 1,
            flexDirection: "column",
            height: 200,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "40%",
                height: "70%",
              }}
            >
              <SectionImage
                source={{
                  uri: `http://image.tmdb.org/t/p/w500/${props.movieInformation.movies?.poster_path}`,
                }}
                style={{ height: "100%", width: "100%", borderRadius: 12 }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <View style={{ position: "absolute", left: 120, width: "55%" }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>
                  {props.movieInformation.movies?.title}
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {props.movieInformation.movies?.["overview"]?.substring(0, 150) + "..."}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Section>
    </TouchableOpacity>
  );
}

export default memo(MovieImageCardWithDetails);
