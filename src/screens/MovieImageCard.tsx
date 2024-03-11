import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { TouchableOpacity } from "react-native";
import { Section, SectionImage } from "react-native-rapi-ui";
import { MovieDbResponse } from "./Home";
import { MovieNavigationStackParamList } from "../navigation/MovieNavigationStack";
import {
  fromWhichScreenMovieDetails,
  isAllMoviePageOpen,
} from "../states/atom";
import { useAtom } from "jotai";
import { LikedMovieNavigationStackParamList } from "../navigation/LikedMovieNavigationStack";
interface MovieImageCardProps {
  movieInformation: MovieDbResponse;
  from: "home" | "liked";
}
function MovieImageCard(props: MovieImageCardProps) {
  const navigation =
    useNavigation<NavigationProp<MovieNavigationStackParamList>>();
  const LikedMovieNavigation =
    useNavigation<NavigationProp<LikedMovieNavigationStackParamList>>();
  const [isAllMovieOpen, setIsAllMovieOpen] = useAtom(isAllMoviePageOpen);
  const [whichScreen, setWhichScreen] = useAtom(fromWhichScreenMovieDetails);
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.from === "home") {
          setIsAllMovieOpen(true);
          setWhichScreen("home");
          navigation.navigate("MovieAllDetails", {
            movieId: props.movieInformation.movie_id,
          });
        } else {
          setIsAllMovieOpen(true);
          setWhichScreen("likedMovies");
          LikedMovieNavigation.navigate("MovieAllDetailsFromLikedMoviePages", {
            movieId: props.movieInformation.movie_id,
          });
        }
      }}
    >
      <Section style={{ width: 120 }}>
        <SectionImage
          source={{
            uri: `http://image.tmdb.org/t/p/w500/${props.movieInformation.movies?.poster_path}`,
          }}
        />
      </Section>
    </TouchableOpacity>
  );
}
export default memo(MovieImageCard);
