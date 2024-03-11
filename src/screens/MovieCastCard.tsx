import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import React, { memo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Section, SectionImage, Text } from "react-native-rapi-ui";
import { MovieNavigationStackParamList } from "../navigation/MovieNavigationStack";
import { isAllMoviePageOpen } from "../states/atom";
import { Database } from "../types/navigation";
interface MovieCastCardProps {
  castInformation: Database["public"]["Tables"]["credit_info"]["Row"];
}
function MovieCastCard(props: MovieCastCardProps) {
  const navigation =
    useNavigation<NavigationProp<MovieNavigationStackParamList>>();
  const [isAllMovieOpen, setIsAllMovieOpen] = useAtom(isAllMoviePageOpen);

  const [isLoading, setIsLoading] = useState(true);
  return (
    <TouchableOpacity
    //   onPress={() => {
    //     setIsAllMovieOpen(true);
    //     navigation.navigate("MovieAllDetails", {
    //       movieId: props.movieInformation.movie_id,
    //     });
    //   }}
    >
      <Section
        style={{ width: 120 }}
        id={
          props.castInformation.cast_id?.toString()
            ? props.castInformation.cast_id.toString()
            : props.castInformation.character!!
        }
      >
        {/* {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        <Image
          source={{
            uri: `http://image.tmdb.org/t/p/w500/${props.castInformation.profile_path}`,
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        /> */}
        <SectionImage
          source={{
            uri: `http://image.tmdb.org/t/p/w500/${props.castInformation.profile_path}`,
          }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      </Section>
      <Section style={{ marginLeft: 3 }}>
        <Text style={{ width: 120 }} id="name">
          {props.castInformation.name}
        </Text>
        <Text italic={true} id="asTextElemet">
          as
        </Text>
        <Text style={{ width: 120 }} id="character">
          {" "}
          {props.castInformation.character}
        </Text>
      </Section>
    </TouchableOpacity>
  );
}
export default memo(MovieCastCard);
