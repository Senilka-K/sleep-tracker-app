import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const SleepTracker = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isSleeping) {
      setStartTime(new Date());
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);  // Update the current time every second
    } else if (!isSleeping && startTime) {
      clearInterval(interval);
      const sleepDuration = new Date() - startTime;
      console.log(`You slept for ${sleepDuration / 1000} seconds.`);
      setCurrentTime(null);  // Reset current time
    }
    return () => clearInterval(interval);
  }, [isSleeping]);

  const handleSleepToggle = () => {
    setIsSleeping(!isSleeping);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSleepToggle}>
        <Text style={styles.buttonText}>{isSleeping ? 'Wake Up Now' : 'Sleep Now'}</Text>
      </TouchableOpacity>
      {currentTime && (
        <Text style={styles.timerText}>
          Sleeping Time: {(currentTime - startTime) / 1000} seconds
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f4f8',  // A light calming blue background
  },
  button: {
    backgroundColor: '#4CAF50',  // Green button background
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,  // More pronounced rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    marginBottom: 20,  // Space between the button and timer text
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',  // Stylistic choice for uppercase text
  },
  timerText: {
    marginTop: 10,
    fontSize: 20,  // Larger font for better readability
    color: '#333',
    fontWeight: '500',  // Medium weight for the timer text
    paddingHorizontal: 20,  // Horizontal padding to keep the text centered
    backgroundColor: '#ffffff',  // Light background for timer text
    borderRadius: 10,  // Rounded corners for the timer display
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
});

export default SleepTracker;
