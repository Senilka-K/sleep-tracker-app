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
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from "../UserIdStore";
import { useIsFocused } from "@react-navigation/native";
import ApplicationForm from "./Form";

const screenWidth = Dimensions.get("window").width;

const ApplicationFormEditable = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [errors, setErrors] = useState({});
  const [buttonText, setButtonText] = useState("Edit");

  const isFocused = useIsFocused();

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID is not available");
      return;
    }
  
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/edit-form`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          age,
          gender,
          occupation
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Form data updated successfully");
        setIsEditable(false);
        setButtonText("Edit");
      } else {
        throw new Error(result.message || "Failed to update data");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleEditOrSubmit = () => {
    if (isEditable) {
      handleSubmit();
    } else {
      setIsEditable(true);
      setButtonText("Submit");
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this information?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            deleteFormData();
            console.log("Information Deleted");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteFormData = async () => {
    const userId = await getUserId();
    if (userId) {
      try {
        const response = await fetch(
          `${NGROK_STATIC_DOMAIN}/delete-form`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const responseData = await response.json();
        if (response.ok) {
          setName("");
          setAge("");
          setGender("");
          setOccupation("");
          setIsEditable(true);
          navigation.navigate(ApplicationForm);
          console.log("Form data deleted successfully");
          Alert.alert("Success", "Form data deleted successfully");
        } else {
          throw new Error(responseData.message);
        }
      } catch (error) {
        console.error("Error deleting form data:", error);
        Alert.alert("Error", "Failed to delete form data");
      }
    } else {
      Alert.alert("Error", "User ID is not available");
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      if (userId) {
        setUserId(userId);
        try {
          const response = await fetch(
            `${NGROK_STATIC_DOMAIN}/formData`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId }),
            }
          );

          const data = await response.json();

          if (response.status === 200) {
            console.log("success", data);
            setName(data.name);
            setAge(data.age);
            setGender(data.gender);
            setOccupation(data.occupation);
            setIsEditable(false);
            console.log("done");
          } else {
            setName("");
            setAge("");
            setGender("");
            setOccupation("");
            setIsEditable(true);
          }
        } catch (error) {
          console.error("Error!", error);
        }
      }
    };

    fetchUserId();
  }, [isFocused]);

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
              editable={isEditable}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Age"
              value={age}
              onChangeText={setAge}
              editable={isEditable}
            />
            {errors.age ? (
              <Text style={styles.errorText}>{errors.age}</Text>
            ) : null}
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Gender"
              value={gender}
              onChangeText={setGender}
              editable={isEditable}
            />
            {errors.gender ? (
              <Text style={styles.errorText}>{errors.gender}</Text>
            ) : null}
            <Text style={styles.label}>Occupation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Occupation"
              value={occupation}
              onChangeText={setOccupation}
              editable={isEditable}
            />
            {errors.occupation ? (
              <Text style={styles.errorText}>{errors.occupation}</Text>
            ) : null}
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEditOrSubmit}
              >
                <Text style={styles.actionButtonText}>{buttonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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

export default ApplicationFormEditable;
