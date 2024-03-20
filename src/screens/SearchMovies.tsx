import React, {
  useCallback,
  useContext,
  useDeferredValue,
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

import { Ionicons } from "@expo/vector-icons";
import "react-native-get-random-values";
import { Layout, Text, TextInput } from "react-native-rapi-ui";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../initSupabase";
import { AuthContext } from "../provider/AuthProvider";
import { Database } from "../types/navigation";
import MovieImageCardWithDetails from "./MovieImageCardWithDetails";
import { MovieDbResponse } from "./Home";

export type actionForReducer = {
  type: "SET_MOVIES";
  payload: MovieDbResponse[];
};
export type stateForMovie = {
  movies: MovieDbResponse[];
};
export function reducer(state: stateForMovie, action: actionForReducer) {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
      };
  }
}
export function initialState(): stateForMovie {
  return {
    movies: [],
  };
}
export function getActionType(
  tableName: string,
  setOrUpdate: "set"
): actionForReducer["type"] {
  switch (tableName) {
    case "movies":
      return "SET_MOVIES";
    default:
      throw new Error(`Invalid table name: ${tableName}`);
  }
}
export default function () {
  const authCtx = useContext(AuthContext);
  const userEmail = authCtx.session?.user?.email;

  const [movieState, dispatch] = useReducer(reducer, {}, initialState);
  const deferredMovieState = useDeferredValue(movieState);
  const deferredMovies = useDeferredValue(deferredMovieState.movies);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const fetchMovies = useCallback(
    async (tableName: string, searchTerm: string) => {
      try {
        const { data, error }: { data: any[] | null; error: any } =
          await supabase
            .from(tableName)
            .select()
            .textSearch("fts", searchTerm, {
              type: "websearch",
            });
        if (error !== null) {
          throw new Error(error);
        }
        if (data !== null) {
          const newData: MovieDbResponse[] = [];
          for (let item of data) {
            delete item.fts;
            newData.push({ movie_id: item.id, movies: item });
          }
          switch (tableName) {
            case "movies":
              dispatch({
                type: getActionType(tableName, "set"),
                payload: newData,
              });
              break;
            default:
              throw new Error(
                `Invalid table name in dispath call: ${tableName}`
              );
          }
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Something went wrong while trying to search the movie");
      }
    },
    []
  );

  function callFetchMoviesPopular(searchTerm: string) {
    fetchMovies("movies", searchTerm);
  }

  const onRefresh = useCallback(() => {
    console.log("this function called");
    setRefreshing(true);
    dispatch({ type: "SET_MOVIES", payload: [] });
    setRefreshing(false);
  }, []);

  const renderDetailItem = useCallback(
    ({ item }: { item: MovieDbResponse }) => (
      <MovieImageCardWithDetails from="search" movieInformation={item} />
    ),
    []
  );
  const keyExtractor = useCallback(
    (item: MovieDbResponse) =>
      item.movies?.id.toString().length ? item.movies.id.toString() : "Alright",
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
              //   flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: 20,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text fontWeight="bold" style={{ fontSize: 20, marginLeft: 10 }}>
                Hello{" "}
                {userEmail !== undefined && userEmail !== null
                  ? userEmail.substring(0, userEmail.indexOf("@"))
                  : "Guest"}{" "}
              </Text>
            </View>
            <View>
              <Text fontWeight="bold" style={{ fontSize: 20, marginLeft: 10 }}>
                Let's search some movies
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <TextInput
              placeholder="Enter your movie name "
              value={searchTerm}
              onChangeText={(val) => {
                setSearchTerm(val);
                callFetchMoviesPopular(val);
              }}
              rightContent={<Ionicons name="search-outline" size={20} />}
              onSubmitEditing={() => {
                callFetchMoviesPopular(searchTerm);
              }}
            />
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
              <FlatList
                data={deferredMovies}
                style={{ margin: 10 }}
                horizontal={true}
                ItemSeparatorComponent={() => (
                  <View key={`${uuidv4()}`} style={{ width: 10 }} />
                )}
                keyExtractor={keyExtractor}
                renderItem={renderDetailItem}
                onEndReachedThreshold={0.9}
                removeClippedSubviews={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}
