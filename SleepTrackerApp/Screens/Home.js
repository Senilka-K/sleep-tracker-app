import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { storeUserId } from "../UserIdStore";
import { NGROK_STATIC_DOMAIN } from '@env';
import ApplicationForm from "./Form";
import Buttons from "./Buttons";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState(false);
  
    const validateForm = () => {
      let errors = {};

      if (!username) {
        errors.username = "Username is required";
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => { 
      if (validateForm()) {
        try {
          const response = await fetch(`${NGROK_STATIC_DOMAIN}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
          });
    
          const data = await response.json();
    
          if (response.status === 200) {
            setLoginSuccess(`${username} logged in successfully`);
            storeUserId(data.user);
            setUsername("");
            setErrors({});
    
            const statusResponse = await fetch(`${NGROK_STATIC_DOMAIN}/check-form-status`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ userId: data.user })
            });
    
            const statusData = await statusResponse.json();
    
            if (statusData.formFilled) {
              navigation.navigate(Buttons);
            } else {
              navigation.navigate(ApplicationForm);
            }
    
          } else {
            setLoginSuccess("");
            Alert.alert("Login Failed", data.message);
          }
        } catch (error) {
          setLoginSuccess("");
          Alert.alert("Network Error", "Unable to connect to server");
        }
      } else {
        setLoginSuccess("");
      }
    };
    

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      <Text style={styles.text}>Welcome</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        {errors.username ? (
          <Text style={styles.errorText}>{errors.username}</Text>
        ) : null}
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSubmit}>
            <Text style={styles.actionButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      {loginSuccess && <Text style={styles.successText}>{loginSuccess}</Text>}
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 48, 
    marginBottom: 60,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    width: screenWidth - 70,
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
    marginBottom: 80,
  },
  label: {
    fontSize: 24,
    marginBottom: 25,
    fontWeight: "bold",
    textAlign: "center"
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center"
  },
  successText: {
    padding: 20,
  },
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "center",
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
    marginBottom: 25,
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

