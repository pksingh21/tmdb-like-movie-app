import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

import "react-native-get-random-values";
import { Layout, Text } from "react-native-rapi-ui";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../initSupabase";
import { AuthContext } from "../provider/AuthProvider";
import { MovieDbResponse } from "./Home";
import MovieImageCardWithDetails from "./MovieImageCardWithDetails";
export default function () {
  const authCtx = useContext(AuthContext);
  // console.log(authCtx.session?.user?.id);
  const userEmail = authCtx.session?.user?.email;
  const [nowPlayingMovie, setNowPlayingMovie] = useState<
    MovieDbResponse[] | null
  >(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fetchMovies = useCallback(
    async (tableName: string) => {
      try {
        const {
          data,
          error,
        }: { data: { movie_id: number }[] | null; error: any } = await supabase
          .from(tableName)
          .select(`movie_id`)
          .eq(`person_id`, authCtx.session?.user?.id)
          .range(page * 10, page * 10 + 9);
        if (error) {
          throw new Error(error);
        }

        const data2 = data;
        if (data2 !== null) {
          const { data, error }: { data: any[] | null; error: any } =
            await supabase
              .from("movies")
              .select("id,title,poster_path,overview,backdrop_path")
              .in(
                "id",
                data2.map((movie) => movie.movie_id)
              );
          if (error) {
            console.log(error);
            throw new Error("something went wrong");
          }
          if (data) {
            let newData = data.map((item) => {
              return { movie_id: item.id, movies: item };
            });
            setNowPlayingMovie(newData);
          }
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
      fetchMovies("favourite_movies");
    }
  }, []);
  function callFetchMoviesNowPlaying() {
    fetchMovies("favourite_movies");
  }
  const onRefresh = useCallback(() => {
    console.log("this function called");
    setRefreshing(true);
    fetchMovies("favourite_movies");
    setRefreshing(false);
  }, []);

  const renderDetailItem = useCallback(
    ({ item }: { item: MovieDbResponse }) => (
      <MovieImageCardWithDetails from="liked" movieInformation={item} />
    ),
    []
  );
  const keyExtractor = useCallback(
    (item: MovieDbResponse) => item.movies!!.id.toString(),
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
                Your Liked Movies
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
