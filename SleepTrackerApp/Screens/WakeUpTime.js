import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WakeTimeSelector = () => {
  const [wakeTime, setWakeTime] = useState(new Date());
  const [showWakePicker, setShowWakePicker] = useState(false);

  const onChangeWake = (event, selectedDate) => {
    const currentDate = selectedDate || wakeTime;
    setShowWakePicker(Platform.OS === 'ios');
    setWakeTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set Your Wake-Up Alarm!</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowWakePicker(true)}>
        <Text style={styles.buttonText}>Set Wake-Up Time</Text>
      </TouchableOpacity>
      {showWakePicker && (
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
      )}
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

export default WakeTimeSelector;
