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
    backgroundColor: "#f0f9ff", // Light grey background for the overall screen
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Dark grey for better contrast
  },
  form: {
    backgroundColor: "white",
    padding: 20,
    width: screenWidth - 50,
    borderRadius: 15, // Increased border radius
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fieldContainer: {
    marginBottom: 20, // Increased margin for better spacing
  },
  label: {
    fontSize: 18, // Slightly larger font size
    fontWeight: "600", // Less bold than 'bold'
    marginBottom: 10,
    color: "#424242", // Soft black for labels
  },
  input: {
    height: 45, // Taller input fields
    borderColor: '#BDBDBD', // Softer border color
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8, // Rounded corners for input fields
    fontSize: 16, // Slightly larger font size for input
  },
  value: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#E0E0E0", // Lighter background for non-editable fields
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25, // More top margin
    width: '70%', // More breathing room on the sides
  },
  actionButton: {
    backgroundColor: "#2196F3", // A fresher blue shade
    padding: 12,
    borderRadius: 8,
    elevation: 3, // Slight elevation for 3D effect
  },
  deleteButton: {
    backgroundColor: "#F44336", // A vibrant red
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500', // Less bold for a modern look
    fontSize: 16, // Larger font for buttons
  },
});

export default ApplicationFormEditable;
