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
    backgroundColor: "#f0f9ff"
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
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db', 
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,  // More rounded corners
    marginBottom: 15,  // More space below the button
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: screenWidth - 300,
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
    fontSize: 18,
    color: "#fff",
    fontWeight: 'bold',
  },
});

export default ApplicationFormEditable;
