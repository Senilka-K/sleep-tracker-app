import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const ApplicationFormEditable = () => {
  const [formData, setFormData] = useState({
    Name: "John Doe",
    Age: "40",
    Gender: "Male",
    Occupation: "Doctor",
  });

  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const handleUpdate = () => {
    console.log("Updated Data:", formData);
    Alert.alert("Form Updated", "Your form has been successfully updated.");
    setEditMode(false);
  };

  const handleDelete = () => {
    console.log("Form Data Deleted");
    Alert.alert("Form Deleted", "Your form has been successfully deleted.");
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Application Form</Text>
        <View style={styles.form}>
          {Object.entries(formData).map(([key, value]) => (
            <View key={key} style={styles.fieldContainer}>
              <Text style={styles.label}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => handleInputChange(key, text)}
                  value={value}
                />
              ) : (
                <Text style={styles.value}>{value}</Text>
              )}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          {editMode ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={toggleEditMode}>
              <Text style={styles.buttonText}>Edit Form</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete Form</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  value: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  actionButton: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ApplicationFormEditable;
