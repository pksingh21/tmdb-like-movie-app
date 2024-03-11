import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Layout, Text } from "react-native-rapi-ui";
import { AuthContext } from "../provider/AuthProvider";
import { supabase } from "../initSupabase";
import { Database } from "../types/navigation";
import MovieImageCard from "./MovieImageCard";
import MovieImageCardWithDetails from "./MovieImageCardWithDetails";
export interface MovieDbResponse {
  movie_id: number;
  movies: Database["public"]["Tables"]["movies"]["Row"] | null;
}
export default function () {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  // console.log(authCtx.session?.user?.id);
  const userEmail = authCtx.session?.user?.email;
  const [popularMovies, setPopularMovies] = useState<MovieDbResponse[] | null>(
    null
  );
  const [topRatedMovies, setTopRatedMovies] = useState<
    MovieDbResponse[] | null
  >(null);
  const [nowPlayingMovie, setNowPlayingMovie] = useState<
    MovieDbResponse[] | null
  >(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fetchMovies = useCallback(
    async (
      tableName: string,
      setMovies: React.Dispatch<React.SetStateAction<MovieDbResponse[] | null>>,
      movies: MovieDbResponse[] | null,
      columns: string[]
    ) => {
      try {
        const { data, error }: { data: MovieDbResponse[] | null; error: any } =
          await supabase
            .from(tableName)
            .select(`movie_id,movies (${columns.join(",")})`)
            .range(page * 10, page * 10 + 9);
        if (error) {
          throw new Error(error);
        }
        if (data !== null) {
          if (movies !== null)
            setMovies((prevMovies) => [...prevMovies!!, ...data!!]);
          else setMovies(data);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Something went wrong while trying to fetch the movie");
      }
    },
    [page]
  );

  useEffect(() => {
    if (userEmail !== undefined) {
      fetchMovies("popular", setPopularMovies, popularMovies, [
        "title",
        "poster_path",
      ]);
      fetchMovies("top_rated", setTopRatedMovies, topRatedMovies, [
        "title",
        "poster_path",
      ]);
      fetchMovies("now_playing", setNowPlayingMovie, nowPlayingMovie, [
        "title",
        "poster_path",
        "backdrop_path",
        "overview",
      ]);
    }
  }, []);
  function callFetchMoviesPopular() {
    fetchMovies("popular", setPopularMovies, popularMovies, [
      "title",
      "poster_path",
    ]);
  }
  function callFetchMoviesTopRated() {
    fetchMovies("top_rated", setTopRatedMovies, topRatedMovies, [
      "title",
      "poster_path",
    ]);
  }
  function callFetchMoviesNowPlaying() {
    fetchMovies("now_playing", setNowPlayingMovie, nowPlayingMovie, [
      "title",
      "poster_path",
      "backdrop_path",
      "overview",
    ]);
  }
  const onRefresh = useCallback(() => {
    console.log("this function called");
    setRefreshing(true);
    fetchMovies("popular", setPopularMovies, popularMovies, [
      "title",
      "poster_path",
    ]);
    fetchMovies("top_rated", setTopRatedMovies, topRatedMovies, [
      "title",
      "poster_path",
    ]);
    fetchMovies("now_playing", setNowPlayingMovie, nowPlayingMovie, [
      "title",
      "poster_path",
      "backdrop_path",
      "overview",
    ]);
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MovieDbResponse }) => (
      <MovieImageCard from="home" movieInformation={item} />
    ),
    []
  );
  const renderDetailItem = useCallback(
    ({ item }: { item: MovieDbResponse }) => (
      <MovieImageCardWithDetails from="home" movieInformation={item} />
    ),
    []
  );
  const keyExtractor = useCallback(
    (item: MovieDbResponse) => item.movie_id.toString(),
    []
  );

  return (
    <Layout style={{ flex: 1, marginTop: 20 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Text fontWeight="bold" style={{ fontSize: 20, marginLeft: 10 }}>
              Hello{" "}
              {userEmail !== undefined && userEmail !== null
                ? userEmail.substring(0, userEmail.indexOf("@"))
                : "Guest"}{" "}
            </Text>
          </View>
          <View>
            <Text
              fontWeight="bold"
              style={{
                fontSize: 20,
                marginLeft: 10,
                marginTop: 20,
                marginBottom: -10,
              }}
            >
              Popular
            </Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {popularMovies !== null ? (
                <FlatList
                  data={popularMovies}
                  style={{ margin: 10 }}
                  horizontal={true}
                  ItemSeparatorComponent={() => (
                    <View key={`${uuidv4()}`} style={{ width: 10 }} />
                  )}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  onEndReached={callFetchMoviesPopular}
                  onEndReachedThreshold={0.9}
                  removeClippedSubviews={true}
                />
              ) : (
                <Text>Loading</Text>
              )}
            </View>
          </View>
        </View>
        <View>
          <View>
            <View>
              <Text
                fontWeight="bold"
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  marginTop: 20,
                  marginBottom: -10,
                }}
              >
                Top Rated
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {topRatedMovies !== null ? (
                <FlatList
                  data={topRatedMovies}
                  style={{ margin: 10 }}
                  horizontal={true}
                  ItemSeparatorComponent={() => (
                    <View key={`${uuidv4()}`} style={{ width: 10 }} />
                  )}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  onEndReached={callFetchMoviesTopRated}
                  onEndReachedThreshold={0.9}
                  removeClippedSubviews={true}
                />
              ) : (
                <Text>Loading</Text>
              )}
            </View>
          </View>
          <View>
            <View>
              <Text
                fontWeight="bold"
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Now Playing
              </Text>
            </View>
            <View>
              {nowPlayingMovie !== null ? (
                <FlatList
                  data={nowPlayingMovie}
                  style={{ margin: 10 }}
                  horizontal={true}
                  ItemSeparatorComponent={() => (
                    <View key={`${uuidv4()}`} style={{ width: 10 }} />
                  )}
                  keyExtractor={keyExtractor}
                  renderItem={renderDetailItem}
                  onEndReached={callFetchMoviesNowPlaying}
                  onEndReachedThreshold={0.9}
                  removeClippedSubviews={true}
                />
              ) : (
                <Text>Loading !!</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
