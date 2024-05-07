import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WakeTimeSelector = ( { navigation } ) => {
  const [wakeTime, setWakeTime] = useState(new Date());

  const onChangeWake = (event, selectedDate) => {
    const currentDate = selectedDate || wakeTime;
    setWakeTime(currentDate);
  };

  const saveWakeUpTime = () => {
    console.log('Wake Up Time saved:', wakeTime.toLocaleTimeString());
    navigation.navigate('MainTabs')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set Your Wake-Up Alarm!</Text>
      <View style={styles.pickerContainer}>
        <DateTimePicker
          style={styles.datetimepicker}
          value={wakeTime}
          mode="time"
          display="spinner"
          onChange={onChangeWake}
          textColor="#fff"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={saveWakeUpTime}>
        <Text style={styles.buttonText}>Save Wake-Up Time</Text>
      </TouchableOpacity>
      <Text style={styles.timeText}>Wake up at: {wakeTime.toLocaleTimeString()}</Text>
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
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 20,
    marginBottom: 80,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  datetimepicker: {
    width: 300,
    height: 180,
  },
});

export default WakeTimeSelector;
