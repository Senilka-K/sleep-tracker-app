import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const sleepIcon = require('../assets/sleep_icon.png'); // Replace with your actual sleep icon
const habitIcon = require('../assets/habit_icon.png'); // Replace with your actual habit icon
const stressIcon = require('../assets/stress_icon.png'); // Replace with your actual stress icon
const gameIcon = require('../assets/game_icon.png'); // Replace with your actual gamification icon

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
          <Image source={sleepIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Sleep Monitor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Habit Tracker')}>
          <Image source={habitIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Habit Tracker</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Stress Monitor')}>
          <Image source={stressIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Stress Monitor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Gamification')}>
          <Image source={gameIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Gamification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Soft light grey background for less strain
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    color: '#1a237e', // Indigo text color for emphasis
    fontSize: 40, // Adjusted for better proportion
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 20,
  },
  subHeaderText: {
    color: '#37474f', // Deep blue-grey for subtle emphasis
    fontSize: 24, // Adjusted size for hierarchy
    textAlign: "center",
    marginBottom: 50, // Increased spacing for airy feel
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20, // Reduced to avoid too much spacing
    marginBottom: 40, // Consistent spacing for visual rhythm
  },
  button: {
    backgroundColor: '#5c6bc0', // Soothing deep purple
    paddingVertical: 15, // Optimized padding for touch
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 12, // Slightly rounded for a modern look
    width: '45%', // Maintaining proportion for better aesthetics
    elevation: 3, // Subtle shadow for 3D effect
  },
  buttonText: {
    color: '#ffffff', // White text for contrast
    textAlign: 'center',
    fontSize: 22, // Optimized size for readability
    fontWeight: '500', // Medium font weight for clarity
    marginVertical: 10, // Vertical margin for better text space
  },
  icon: {
    width: 50, // Adjusted size for balance
    height: 50, // Match width for proportion
    marginBottom: 10, // Space between icon and text
  },
});

export default Buttons;
