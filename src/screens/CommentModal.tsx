import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Text as RapiText,
  Section,
  TextInput,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { AuthContext } from "../provider/AuthProvider";
interface CommentModalProps {
  MovieId: number;
}
const CommentModal = (props: CommentModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<
    {
      user_comment: string;
      user_email_id: string;
    }[]
  >([]); // State to hold fetched comments

  const { isDarkmode } = useTheme();
  const AuthCtx = useContext(AuthContext);
  const { height, width } = useWindowDimensions();
  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Please enter a comment!");
      return;
    }

    try {
      const { data, error } = await supabase.from("movie_comments").insert([
        {
          movie_id: props.MovieId /* Your movie ID */, // Replace with the actual movie ID
          user_id: AuthCtx.session?.user?.id /* Your user ID */, // Replace with the actual user ID
          user_comment: comment,
          user_email_id: AuthCtx.session?.user?.email,
        },
      ]);

      if (error) {
        console.error("Comment submission error:", error);
        Alert.alert("Error submitting comment. Please try again.");
        return;
      }

      console.log("Comment submitted successfully:", data);
      Alert.alert("Comment submitted successfully!");
      setComment(""); // Clear comment field after successful submission
      setModalVisible(false); // Close modal after submission
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("An unexpected error occurred. Please try again.");
    }
  };
  useEffect(() => {
    // Fetch comments on component mount
    fetchComments();
  }, [props]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("movie_comments")
        .select("user_comment, user_email_id") // Select only necessary fields
        .eq("movie_id", props.MovieId);
      if (error) {
        console.error("Comment fetching error:", error);
        Alert.alert("Error fetching comments. Please try again.");
        return;
      }
      if (error) {
        throw new Error("something went wrong");
      } else {
        // console.log(data);
        setComments(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Section borderRadius={0} style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <Section style={styles.centeredView}>
          {/* {console.log(comments)} */}
          {comments ? (
            <FlatList
              data={comments}
              style={{ height: height * 0.01, marginTop: 10 }}
              renderItem={({ item }) => (
                <Section style={{ margin: 20 }}>
                  <RapiText style={{ fontSize: 16, fontWeight: "bold" }}>
                    User: {item.user_email_id}
                  </RapiText>

                  <RapiText style={{ fontSize: 16, fontWeight: "bold" }}>
                    Comment :
                  </RapiText>
                  <RapiText style={{ fontSize: 14, marginTop: 5 }}>
                    {item.user_comment}
                  </RapiText>
                </Section>
              )}
              //   keyExtractor={(item) => item.user_comment}
            />
          ) : (
            <RapiText>No Comments yet</RapiText>
          )}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={{ width: width * 0.9 }}>
              <TextInput
                placeholder="Enter your comment"
                multiline={true}
                numberOfLines={10}
                onChangeText={setComment}
                value={comment}
              />
              <Pressable
                style={[styles.button, { marginTop: 10 }]}
                onPress={handleCommentSubmit}
              >
                <RapiText style={{ textAlign: "center" }}>
                  Submit Comment
                </RapiText>
              </Pressable>
            </View>

            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <RapiText style={{ textAlign: "center" }}>
                Close comment section
              </RapiText>
            </Pressable>
          </View>
        </Section>
      </Modal>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: isDarkmode ? themeColor.dark : themeColor.white100,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <RapiText>Comments</RapiText>
      </Pressable>
    </Section>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default CommentModal;
