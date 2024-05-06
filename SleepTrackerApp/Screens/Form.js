import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    ScrollView,
    Alert,
  } from "react-native";
  import { useState, useEffect } from "react";
  import { getUserId } from "../UserIdStore";
  
  const screenWidth = Dimensions.get("window").width;
  
  export default function ApplicationForm() {
    const [name, setName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [comment, setComment] = useState("");
    const [likesTracking, setLikesTracking] = useState(null);
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.container}>
            <Text style={styles.text}>Application Form</Text>
            <View style={styles.form}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Name"
                value={name}
                onChangeText={setName}
              />
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
              <Text style={styles.label}>Contact No:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Contact No"
                value={contactNo}
                onChangeText={setContactNo}
              />
              {errors.contactNo ? (
                <Text style={styles.errorText}>{errors.contactNo}</Text>
              ) : null}
              <Text style={styles.label}>Comment</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Comment"
                value={comment}
                onChangeText={setComment}
              />
              {errors.comment ? (
                <Text style={styles.errorText}>{errors.comment}</Text>
              ) : null}
              <Text style={styles.label}>Do you like Tracking:</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    likesTracking === "yes" ? styles.buttonSelected : null,
                  ]}
                  onPress={() => setLikesTracking("yes")}
                >
                  <Text style={styles.buttonText}>
                    yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    likesTracking === "no" ? styles.buttonSelected : null,
                  ]}
                  onPress={() => setLikesTracking("no")}
                >
                  <Text style={styles.buttonText}>
                    no
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.likesTracking ? (
                <Text style={styles.errorText}>{errors.likesTracking}</Text>
              ) : null}
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>
                  Done
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>
                  Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>
                  Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      paddingTop: 20,
      marginBottom: 16,
    },
    form: {
      backgroundColor: "white",
      padding: 20,
      width: screenWidth - 50,
      borderRadius: 10,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: "bold",
    },
    input: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
    },
    errorText: {
      color: "red",
      marginBottom: 10,
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#ddd",
      padding: 10,
      width: 100,
      alignItems: "center",
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 16,
      color: "#000",
    },
    buttonSelected: {
      backgroundColor: "#007BFF",
      color: "#fff",
    },
    actionButtonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    actionButton: {
      backgroundColor: "grey",
      padding: 10,
      width: screenWidth - 300,
      alignItems: "center",
      borderRadius: 5,
    },
    actionButtonText: {
      fontSize: 16,
      color: "#fff",
    },
  });