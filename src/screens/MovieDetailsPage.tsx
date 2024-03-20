import { NavigationProp, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import "react-native-get-random-values";
import { Text as RapiText, Section, themeColor, useTheme } from "react-native-rapi-ui";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../initSupabase";
import { MovieNavigationStackParamList } from "../navigation/MovieNavigationStack";
import { RootState } from "../states/store";
import { Database } from "../types/navigation";
import CommentModal from "./CommentModal";
import LikeButton from "./LikeButton";
import MovieCastCard from "./MovieCastCard";
function MovieAllDetails() {
  const count = useSelector((state: RootState) => state.counter.counter);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<MovieNavigationStackParamList>>();
  const movieId = navigation.getState().routes.at(-1)!!.params?.movieId;
  const [movieDetails, setMovieDetails] = useState<
    Database["public"]["Tables"]["movies"]["Row"] | null
  >(null);
  const [movieGenre, setMovieGenres] = useState<
    Database["public"]["Tables"]["genres"]["Row"][] | null
  >(null);
  const [movieCast, setMovieCast] = useState<
    Database["public"]["Tables"]["credit_info"]["Row"][] | null
  >(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isDarkmode } = useTheme();
  const fetchMovieCast = async () => {
    if (!loading) {
      setLoading(true);
      console.log(movieId);
      const { data: cast, error } = await supabase
        .from("credit_info")
        .select("*")
        .eq("movie_id", movieId)
        .range(page * 10, (page + 1) * 10 - 1);

      if (error) {
        console.log(error);
        throw new Error("Can't fetch cast");
      } else {
        // console.log(cast, "cast");
        if (movieCast !== null) setMovieCast([...movieCast, ...cast]);
        else setMovieCast([...cast]);
        setPage(page + 1);
      }

      setLoading(false);
    }
  };

  async function fetchMovieGenres() {
    const {
      data: genres,
      error,
    }: { data: { genre_id: number }[] | null; error: any } = await supabase
      .from("genre_movie_mapping")
      .select("genre_id")
      .eq("movie_id", movieId);

    if (error || genres === null) {
      console.log(error);
      throw new Error("Can't fetch genres");
    } else {
      const genreIds = genres.map((genre) => genre.genre_id);
      const uniqueGenreIds = Array.from(new Set(genreIds));
      const {
        data: genreNames,
        error: error2,
      }: { data: { id: number; name: string }[] | null; error: any } =
        await supabase
          .from("genres")
          .select("id,name")
          .in("id", uniqueGenreIds);

      if (error2 || genreNames === null) {
        console.log(error2);
        throw new Error("Can't fetch genre names");
      } else {
        setMovieGenres(genreNames);
      }
    }
  }
  async function fetchGiveMovieDetails() {
    const {
      data,
      error,
    }: {
      data: Database["public"]["Tables"]["movies"]["Row"] | null;
      error: any;
    } = await supabase.from("movies").select("*").eq("id", movieId).single();
    if (error) {
      console.log(error);
      throw new Error("cant fetch movie");
    } else {
      // console.log(data);
      setMovieDetails(data);
    }
  }
  useEffect(() => {
    if (movieId !== undefined) {
      fetchGiveMovieDetails();
      fetchMovieGenres();
      fetchMovieCast();
    }
  }, [movieId]);
  if (!movieDetails) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView
      id={movieDetails.id.toString()}
      style={{ flex: 1, flexDirection: "column" }}
    >
      <ImageBackground
        source={{
          uri: `http://image.tmdb.org/t/p/w500/${movieDetails.backdrop_path}`,
        }}
        style={{ width: "100%", height: 550, flex: 1, shadowOpacity: 0.9 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,14)"]}
          style={{ flex: 1, justifyContent: "center", padding: 20 }}
        >
          <Text
            style={{
              marginTop: 140,
              fontSize: 30,
              color: "white",
              marginBottom: 20,
            }}
          >
            {movieDetails.title}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Image
              source={{
                uri: `http://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`,
              }}
              style={{ width: 150, height: 250 }}
            />
            <View style={{ marginLeft: 10 }}>
              <View>
                <View>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 20 }}
                  >
                    {movieDetails.release_date?.substring(0, 4)}{" "}
                  </Text>
                </View>
                <View>
                  {movieGenre?.map((genre, index) => (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                      }}
                      id={(index + 1).toString()}
                    >
                      {genre.name}
                    </Text>
                  ))}
                </View>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 20 }}
                  >
                    Rating: {movieDetails.vote_average}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 20 }}
                  >
                    Runtime: {movieDetails.runtime} mins
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 20 }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 14 }}
                  >
                    {movieDetails.status}
                  </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 20 }}
                  >
                    Revenue
                  </Text>
                  <Text
                    style={{ marginRight: 10, color: "white", fontSize: 14 }}
                  >
                    ${movieDetails.revenue}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      <Section
        borderRadius={0}
        style={{
          flex: 1,
          backgroundColor: "pink",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <View style={{ marginLeft: 20 }}>
          <RapiText fontWeight={"light"} style={{ fontSize: 30 }}>
            Original Title
          </RapiText>
          <RapiText fontWeight={"bold"} style={{ fontSize: 20 }}>
            {movieDetails.original_title}
          </RapiText>
        </View>
        <View style={{ marginLeft: 20, marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <RapiText fontWeight={"light"} style={{ fontSize: 30, flex: 1 }}>
              Overview
            </RapiText>
            <View style={{ marginRight: 40, marginTop: 20 }}>
              <LikeButton movieId={movieDetails.id} />
            </View>
          </View>
          <RapiText
            fontWeight={"medium"}
            style={{ fontSize: 14 }}
            italic={true}
          >
            {movieDetails.tagline}
          </RapiText>

          <RapiText
            fontWeight={"medium"}
            style={{ fontSize: 15, marginTop: 10 }}
          >
            {movieDetails.overview}
          </RapiText>
        </View>
        <View style={{ marginLeft: 20, marginTop: 10 }}>
          <RapiText fontWeight={"light"} style={{ fontSize: 30 }}>
            Home Page
          </RapiText>
          {movieDetails.homepage !== null && movieDetails.homepage.length ? (
            <Pressable
              onPress={() => {
                Linking.openURL(movieDetails.homepage!!);
              }}
              style={{
                elevation: 5, // add elevation
                backgroundColor: isDarkmode ? themeColor.dark : "#fff", // background color
                padding: 10, // padding
                borderRadius: 5, // rounded corners
                marginTop: 10, // margin at the top
                marginRight: 40,
              }}
              android_ripple={{
                color: "lightblue",
              }}
            >
              <RapiText>Go to homepage</RapiText>
            </Pressable>
          ) : (
            <RapiText>No HomePage</RapiText>
          )}
        </View>

        <View style={{ marginLeft: 20, marginTop: 10 }}>
          <RapiText fontWeight={"light"} style={{ fontSize: 30 }}>
            Cast
          </RapiText>
          {movieCast !== null && movieCast.length ? (
            <FlatList
              data={movieCast}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={fetchMovieCast}
              onEndReachedThreshold={0.5}
              horizontal={true}
              ListFooterComponent={
                loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : null
              }
              renderItem={({ item }) => (
                <MovieCastCard key={`${uuidv4()}`} castInformation={item} />
              )}
              ItemSeparatorComponent={() => (
                <View key={`${uuidv4()}`} style={{ width: 10 }} />
              )}
            />
          ) : movieCast === null ? (
            <ActivityIndicator />
          ) : (
            <RapiText>No Cast available in database</RapiText>
          )}
        </View>
      </Section>
      <CommentModal MovieId={movieDetails.id} />
    </ScrollView>
  );
}
export default memo(MovieAllDetails);
