import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


const SettingsScreen = () => {
  const [sleepTime, setSleepTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [alarmFrequency, setAlarmFrequency] = useState('daily');
  const [alarmTone, setAlarmTone] = useState('beep');
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);

  const onChangeSleepTime = (event, selectedDate) => {
    const currentDate = selectedDate || sleepTime;
    setShowSleepPicker(false);
    setSleepTime(currentDate);
  };

  const onChangeWakeTime = (event, selectedDate) => {
    const currentDate = selectedDate || wakeTime;
    setShowWakePicker(false);
    setWakeTime(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Set Sleep Time:</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowSleepPicker(true)}>
          <Text style={styles.buttonText}>Set Sleep Time</Text>
        </TouchableOpacity>
        {showSleepPicker && (
          <DateTimePicker
            value={sleepTime}
            mode="time"
            display="default"
            onChange={onChangeSleepTime}
          />
        )}
        <Text style={styles.valueText}>Sleep at: {sleepTime.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Set Wake-Up Time:</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowWakePicker(true)}>
          <Text style={styles.buttonText}>Set Wake-Up Time</Text>
        </TouchableOpacity>
        {showWakePicker && (
          <DateTimePicker
            value={wakeTime}
            mode="time"
            display="default"
            onChange={onChangeWakeTime}
          />
        )}
        <Text style={styles.valueText}>Wake up at: {wakeTime.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Alarm Frequency:</Text>
        <Picker
          selectedValue={alarmFrequency}
          onValueChange={(itemValue, itemIndex) => setAlarmFrequency(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Alarm Tone:</Text>
        <Picker
          selectedValue={alarmTone}
          onValueChange={(itemValue, itemIndex) => setAlarmTone(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Beep" value="beep" />
          <Picker.Item label="Ring" value="ring" />
          <Picker.Item label="Digital" value="digital" />
        </Picker>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default SettingsScreen;

