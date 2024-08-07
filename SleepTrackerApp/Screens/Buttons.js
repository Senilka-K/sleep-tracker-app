import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


const sleepIcon = require('../assets/sleep_icon.png'); 
const habitIcon = require('../assets/habit_icon.png'); 
const stressIcon = require('../assets/stress_icon.png'); 
const gameIcon = require('../assets/game_icon.png');

const Buttons = ( { navigation } ) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>What do you expect?</Text>
      <Text style={styles.subHeaderText}>Let us know you better</Text>
      
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
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
    backgroundColor: '#f0f9ff', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 40, 
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  subHeaderText: {
    fontSize: 30,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20, 
    marginBottom: 40, 
  },
  button: {
    backgroundColor: '#3498db', 
    paddingVertical: 15, 
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 10,
    width: '45%', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3, 
  },
  buttonText: {
    color: '#ffffff', 
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold', 
    marginVertical: 10,
  },
  icon: {
    width: 50, 
    height: 50,
    marginBottom: 10,
  },
});

export default Buttons;
