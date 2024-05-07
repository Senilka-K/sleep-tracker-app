import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const SleepTimeSelector = ( { navigation } ) => {
  const [sleepTime, setSleepTime] = useState(new Date());
  const [showSleepPicker] = useState(true); // Always show picker

  const onChangeSleep = (event, selectedDate) => {
    const currentDate = selectedDate || sleepTime;
    setSleepTime(currentDate);
  };

  const saveSleepTime = () => {
    console.log('Sleep Time saved:', sleepTime.toLocaleTimeString());
    navigation.navigate('WakeTimeSelector'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Setup Your Bed Time Reminder!</Text>
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
      <TouchableOpacity style={styles.button} onPress={saveSleepTime}>
        <Text style={styles.buttonText}>Save Your Sleep Time</Text>
      </TouchableOpacity>
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
    marginBottom: 40, // Ensure spacing between picker and button
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
