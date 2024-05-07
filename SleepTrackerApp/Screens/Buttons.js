import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Buttons = ( { navigation } ) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>What do you expect?</Text>
      <Text style={styles.subHeaderText}>Let us know you better</Text>
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ApplicationForm')}
        >
          <Text style={styles.buttonText}>Sleep Monitor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Habit Tracker')}>
          <Text style={styles.buttonText}>Habit Tracker</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Stress Monitor')}>
          <Text style={styles.buttonText}>Stress Monitor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Gamification')}>
          <Text style={styles.buttonText}>Gamification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    color: '#333', // Darker text for visibility
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10,
  },
  subHeaderText: {
    color: '#555', // Dark gray for subheader text
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#e0e0e0', // Light gray for buttons
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '45%',
  },
  buttonText: {
    color: '#333', // Dark color for text to stand out
    textAlign: 'center',
    fontSize: 22,
    margin: 8,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default Buttons;
