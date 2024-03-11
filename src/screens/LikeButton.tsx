import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "react-native-rapi-ui";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AuthContext } from "../provider/AuthProvider";
import { supabase } from "../initSupabase";
interface LikedButtonProps {
  movieId: number;
}
export default function LikeButton(props: LikedButtonProps) {
  const liked = useSharedValue(0);
  const { isDarkmode } = useTheme();
  const authCtx = useContext(AuthContext);
  const [isMovieLiked, setIsMovieLiked] = useState(0);

  async function userLikedTheGivenMovie() {
    if (liked.value === 1) {
      // now delete the required entry of movie_id and person_id
      const { data, error } = await supabase
        .from("favourite_movies")
        .delete()
        .eq("movie_id", props.movieId)
        .eq("person_id", authCtx.session?.user?.id);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
      liked.value = 0;
      return;
    }
    const { user } = authCtx;
    if (user) {
      const { data, error } = await supabase
        .from("favourite_movies")
        .insert([
          { movie_id: props.movieId, person_id: authCtx.session?.user?.id },
        ]);
      if (error) {
        console.log(error);
      } else {
        liked.value = 1;
      }
    }
  }
  async function hasTheUserLikedTheMovie() {
    const { data, error } = await supabase
      .from("favourite_movies")
      .select("movie_id")
      .eq("person_id", authCtx.session?.user?.id);
    if (error) {
      console.log(error);
    } else {
      if (data) {
        const movieIds = data.map((movie) => movie.movie_id);
        console.log(movieIds);
        if (movieIds.includes(props.movieId)) {
          liked.value = 1;
        }
      }
    }
  }
  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
      opacity: liked.value,
    };
  });
  useLayoutEffect(() => {
    hasTheUserLikedTheMovie();
  }, []);
  useEffect(() => {}, [isMovieLiked]);
  return (
    <Pressable
      onPress={() => {
        userLikedTheGivenMovie();
        liked.value = withSpring(liked.value ? 0 : 1);
      }}
    >
      <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
        <MaterialCommunityIcons
          name={"heart-outline"}
          size={32}
          color={isDarkmode ? "white" : "black"}
        />
      </Animated.View>

      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons name={"heart"} size={32} color={"red"} />
      </Animated.View>
    </Pressable>
  );
}
