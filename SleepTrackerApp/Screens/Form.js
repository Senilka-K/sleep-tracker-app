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
  import SleepTimeSelector from "./SleepTime";
//   import { getUserId } from "../UserIdStore";
  
  const screenWidth = Dimensions.get("window").width;
  
  const ApplicationForm = ( { navigation } ) =>  {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [occupation, setOccupation] = useState("");
    // const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      let formErrors = {};
      if (!name) formErrors.name = "Name is required";
      if (!age) formErrors.age = "Age is required";
      if (!gender) formErrors.gender = "Gender is required";
      if (!occupation) formErrors.occupation = "Occupation is required";
  
      setErrors(formErrors);
      return Object.keys(formErrors).length === 0; // Return true if no errors
    };
  
    // Handle form submission
    const handleSubmit = () => {
      if (validateForm()) {
        // Navigate to another screen if form is valid
        navigation.navigate('SleepTimeSelector');
      }
    };

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
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Name"
                value={name}
                onChangeText={setName}
              />
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Age"
                value={age}
                onChangeText={setAge}
              />
              {errors.age ? (
                <Text style={styles.errorText}>{errors.age}</Text>
              ) : null}
              <Text style={styles.label}>Gender:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Gender"
                value={gender}
                onChangeText={setGender}
              />
              {errors.gender ? (
                <Text style={styles.errorText}>{errors.gender}</Text>
              ) : null}
              <Text style={styles.label}>Occupation:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Occupation"
                value={occupation}
                onChangeText={setOccupation}
              />
              {errors.occupation ? (
                <Text style={styles.errorText}>{errors.occupation}</Text>
              ) : null}
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText} onPress={handleSubmit}>
                  Submit
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
      backgroundColor: "#f5f5f5", // Light grey background for better contrast
    },
    text: {
      fontSize: 30,
      fontWeight: "bold",
      paddingTop: 20,
      marginBottom: 30,
      color: "#333", // Darker text color for visibility
    },
    form: {
      backgroundColor: "white",
      padding: 20,
      width: screenWidth - 50,
      borderRadius: 10,
      shadowColor: "rgba(0, 0, 0, 0.25)", // Slightly transparent shadow
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    label: {
      fontSize: 20,
      marginBottom: 5,
      fontWeight: "bold",
      color: "#555", // Dark grey label color
    },
    input: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 2,
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
      fontSize: 18,
      color: "#333", // Dark text color for input
    },
    errorText: {
      color: "red",
      marginBottom: 20,
    },
    actionButtonGroup: {
      flexDirection: "row",
      justifyContent: 'center',
      marginTop: 20,
    },
    actionButton: {
      backgroundColor: "#4682B4", // Blue background color for action button
      padding: 10,
      width: screenWidth - 250,
      alignItems: "center",
      borderRadius: 5,
    },
    actionButtonText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: "bold", // Bold action button text
    },
  });

  export default ApplicationForm;