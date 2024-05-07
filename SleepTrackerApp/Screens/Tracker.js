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
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  timerText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default SleepTracker;
