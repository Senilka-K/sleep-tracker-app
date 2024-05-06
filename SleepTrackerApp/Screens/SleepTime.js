import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const SleepTimeSelector = () => {
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showSleepPicker, setShowSleepPicker] = useState(false);

  const onChangeSleep = (event, selectedDate) => {
    const currentDate = selectedDate || sleepTime;
    setShowSleepPicker(Platform.OS === 'ios'); 
    setSleepTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Setup Your Bed Time Reminder!</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowSleepPicker(true)}>
        <Text style={styles.buttonText}>Setup Your Sleep Time</Text>
      </TouchableOpacity>
      {showSleepPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            style={styles.datetimepicker}
            value={sleepTime}
            mode="time"
            display="spinner" 
            onChange={onChangeSleep}
            textColor="#fff" 
          />
        </View>
      )}
      <Text style={styles.timeText}>Sleep at: {sleepTime.toLocaleTimeString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  pickerContainer: {
    width: '80%',
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', 
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'grey',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 40,
  },
  datetimepicker: {
    width: 300, 
    height: 180, 
  },
});

export default SleepTimeSelector;
