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
  import { getUserId } from "../UserIdStore";
  import { NGROK_STATIC_DOMAIN } from '@env';
  
  const screenWidth = Dimensions.get("window").width;
  
  const ApplicationForm = ( { navigation } ) =>  {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [occupation, setOccupation] = useState("");
    const [userId, setUserId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      const fetchUserId = async () => {
        const fetchedUserId = await getUserId();
        setUserId(fetchedUserId);
      };
  
      fetchUserId();
    }, []);

    const validateForm = () => {
      let formErrors = {};
      if (!name) formErrors.name = "Name is required";
      if (!age) formErrors.age = "Age is required";
      if (!gender) formErrors.gender = "Gender is required";
      if (!occupation) formErrors.occupation = "Occupation is required";
  
      setErrors(formErrors);
      return Object.keys(formErrors).length === 0; // Return true if no errors
    };
  
    const handleSubmit = async () => {
      if (validateForm()) {
        const formData = {
          userId,
          name,
          age,
          gender,
          occupation
        };
  
        try {
          const response = await fetch(`${NGROK_STATIC_DOMAIN}/formDetails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
  
          if (response.ok) {
            Alert.alert('Success', 'Form details saved successfully!');
            navigation.navigate(SleepTimeSelector); 
          } else {
            throw new Error('Failed to save form details');
          }
        } catch (error) {
          Alert.alert('Error', error.message);
        }
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
      backgroundColor: "#f0f9ff", 
    },
    text: {
      fontSize: 36, 
      marginBottom: 30,
      textAlign: 'center',
      fontWeight: "bold",
      color: '#34495e', 
    },
    form: {
      backgroundColor: "white",
      padding: 20,
      width: screenWidth - 50,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#dfe1e5',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
      fontWeight: "bold",
    },
    input: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 2,
      marginBottom: 15,
      padding: 10,
      borderRadius: 5,
      fontSize: 18,
      color: "#333", 
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
      backgroundColor: "#3498db",
      paddingVertical: 10,
      paddingHorizontal: 10,
      width: screenWidth - 250,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    actionButtonText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: 'bold',
    },
  });

  export default ApplicationForm;