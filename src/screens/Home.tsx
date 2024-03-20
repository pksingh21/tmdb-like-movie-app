import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
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
import { Database } from "../types/navigation";
import MovieImageCard from "./MovieImageCard";
import MovieImageCardWithDetails from "./MovieImageCardWithDetails";
export interface MovieDbResponse {
  movie_id: number;
  movies: Database["public"]["Tables"]["movies"]["Row"] | null;
}
export type actionForReducer = {
  type:
    | "SET_POPULAR_MOVIES"
    | "UPDATE_POPULAR_MOVIES"
    | "SET_NOW_PLAYING_MOVIE"
    | "UPDATE_NOW_PLAYING_MOVIE"
    | "SET_TOP_RATED_MOVIE"
    | "UPDATE_TOP_RATED_MOVIE"
    | "SET_TOP_RATED_MOVIE"
    | "UPDATE_TOP_RATED_MOVIE";
  payload: MovieDbResponse[];
};
export type stateForMovie = {
  popularMovies: MovieDbResponse[];
  topRatedMovies: MovieDbResponse[];
  nowPlayingMovie: MovieDbResponse[];
};
export function reducer(state: stateForMovie, action: actionForReducer) {
  switch (action.type) {
    case "SET_POPULAR_MOVIES":
      return {
        ...state,
        popularMovies: action.payload,
      };
    case "UPDATE_POPULAR_MOVIES":
      return {
        ...state,
        popularMovies: [...state.popularMovies, ...action.payload],
      };
    case "SET_TOP_RATED_MOVIE":
      return {
        ...state,
        topRatedMovies: action.payload,
      };
    case "UPDATE_TOP_RATED_MOVIE":
      return {
        ...state,
        topRatedMovies: [...state.topRatedMovies, ...action.payload],
      };
    case "SET_NOW_PLAYING_MOVIE":
      return {
        ...state,
        nowPlayingMovie: action.payload,
      };
    case "UPDATE_NOW_PLAYING_MOVIE":
      return {
        ...state,
        nowPlayingMovie: [...state.nowPlayingMovie, ...action.payload],
      };
  }
}
export function initialState(): stateForMovie {
  return {
    popularMovies: [],
    topRatedMovies: [],
    nowPlayingMovie: [],
  };
}
export function getActionType(
  tableName: string,
  setOrUpdate: "set" | "update"
): actionForReducer["type"] {
  if (setOrUpdate === "update") {
    switch (tableName) {
      case "popular_duplicate":
        return "UPDATE_POPULAR_MOVIES";
      case "top_rated":
        return "UPDATE_TOP_RATED_MOVIE";
      case "now_playing":
        return "UPDATE_NOW_PLAYING_MOVIE";
      default:
        throw new Error(`Invalid table name: ${tableName}`);
    }
  } else {
    switch (tableName) {
      case "popular_duplicate":
        return "SET_POPULAR_MOVIES";
      case "top_rated":
        return "SET_TOP_RATED_MOVIE";
      case "now_playing":
        return "SET_NOW_PLAYING_MOVIE";
      default:
        throw new Error(`Invalid table name: ${tableName}`);
    }
  }
}
export default function () {
  const authCtx = useContext(AuthContext);
  console.log(authCtx.session?.user?.email);
  const userEmail = authCtx.session?.user?.email;

  const [movieState, dispatch] = useReducer(reducer, {}, initialState);

  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fetchMovies = useCallback(
    async (tableName: string, columns: string[]) => {
      console.log(tableName, "table name function called");
      try {
        const { data, error }: { data: MovieDbResponse[] | null; error: any } =
          await supabase
            .from(tableName)
            .select(`movie_id,movies (${columns.join(",")})`)
            .range(page * 10, page * 10 + 9);
        if (error !== null) {
          throw new Error(error);
        }
        if (data !== null) {
          switch (tableName) {
            case "popular_duplicate":
              if (movieState.popularMovies.length === 0) {
                dispatch({
                  type: getActionType(tableName, "set"),
                  payload: data,
                });
              } else {
                dispatch({
                  type: getActionType(tableName, "update"),
                  payload: data,
                });
              }
              break;
            case "top_rated":
              if (movieState.topRatedMovies.length === 0) {
                dispatch({
                  type: getActionType(tableName, "set"),
                  payload: data,
                });
              } else {
                dispatch({
                  type: getActionType(tableName, "update"),
                  payload: data,
                });
              }
              break;
            case "now_playing":
              if (movieState.nowPlayingMovie.length === 0) {
                dispatch({
                  type: getActionType(tableName, "set"),
                  payload: data,
                });
              } else {
                dispatch({
                  type: getActionType(tableName, "update"),
                  payload: data,
                });
              }
              break;
            default:
              throw new Error(
                `Invalid table name in dispath call: ${tableName}`
              );
          }
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
    async function fetchAllMovies() {
      await Promise.all([
        fetchMovies("popular_duplicate", ["title", "poster_path"]),
        fetchMovies("top_rated", ["title", "poster_path"]),
        fetchMovies("now_playing", [
          "title",
          "poster_path",
          "backdrop_path",
          "overview",
        ]),
      ]);
    }
    if (userEmail !== undefined) {
      fetchAllMovies();
    }
  }, []);
  function callFetchMoviesPopular() {
    fetchMovies("popular_duplicate", ["title", "poster_path"]);
  }
  function callFetchMoviesTopRated() {
    fetchMovies("top_rated", ["title", "poster_path"]);
  }
  function callFetchMoviesNowPlaying() {
    fetchMovies("now_playing", [
      "title",
      "poster_path",
      "backdrop_path",
      "overview",
    ]);
  }
  const onRefresh = useCallback(async () => {
    console.log("this function called");
    setRefreshing(true);
    await Promise.all([
      fetchMovies("popular_duplicate", ["title", "poster_path"]),
      fetchMovies("top_rated", ["title", "poster_path"]),
      fetchMovies("now_playing", [
        "title",
        "poster_path",
        "backdrop_path",
        "overview",
      ]),
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
              {movieState.popularMovies.length > 0 ? (
                <FlatList
                  data={movieState.popularMovies}
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
              {movieState.topRatedMovies.length > 0 ? (
                <FlatList
                  data={movieState.topRatedMovies}
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
              {movieState.nowPlayingMovie.length > 0 ? (
                <FlatList
                  data={movieState.nowPlayingMovie}
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
                <Text>Loading</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
