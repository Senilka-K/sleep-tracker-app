import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const SettingsScreen = () => {
  const [userId, setUserId] = useState(null);
  const [sleepTime, setSleepTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [initialSleepTime, setInitialSleepTime] = useState(new Date(sleepTime));
  const [initialWakeTime, setInitialWakeTime] = useState(new Date(wakeTime));
  const [alarmFrequency, setAlarmFrequency] = useState('daily');
  const [alarmTone, setAlarmTone] = useState('beep');
  const [showSleepPicker, setShowSleepPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const fetchedUserId = await getUserId();
      if (fetchedUserId) {
        setUserId(fetchedUserId);
        try {
          const response = await fetch(`${NGROK_STATIC_DOMAIN}/times/${fetchedUserId}`);
          const data = await response.json();
          if (response.ok) {
            const fetchedSleepTime = new Date(data.sleepTime);
            const fetchedWakeTime = new Date(data.wakeUpTime);
            setSleepTime(fetchedSleepTime);
            setWakeTime(fetchedWakeTime);
            setInitialSleepTime(fetchedSleepTime);
            setInitialWakeTime(fetchedWakeTime);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          Alert.alert('Error', `Failed to fetch times: ${error.message}`);
        }
      }
    };

    fetchData();
  }, []);

  const onSaveTimes = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/update-times/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sleepTime: sleepTime.toISOString(),
          wakeUpTime: wakeTime.toISOString(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Times updated successfully');
        setInitialSleepTime(new Date(sleepTime));
        setInitialWakeTime(new Date(wakeTime));
        setIsSaveEnabled(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update times: ${error.message}`);
    } finally {
      setIsSaving(false); 
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const onChangeSleepTime = (event, selectedDate) => {
    if (event.type === 'set') { 
      const currentDate = selectedDate || sleepTime;
      setShowSleepPicker(true);
      setSleepTime(currentDate);
      checkForChanges(currentDate, wakeTime);
    } else {
      setShowSleepPicker(false);
    }
  };

  const onChangeWakeTime = (event, selectedDate) => {
    if (event.type === 'set') { 
      const currentDate = selectedDate || wakeTime;
      setShowWakePicker(true);
      setWakeTime(currentDate);
      checkForChanges(sleepTime, currentDate);
    } else {
      setShowWakePicker(false);
    }
  };

  const checkForChanges = (newSleepTime, newWakeTime) => {
    if (newSleepTime.toISOString() !== initialSleepTime.toISOString() ||
        newWakeTime.toISOString() !== initialWakeTime.toISOString()) {
      setIsSaveEnabled(true);
    } else {
      setIsSaveEnabled(false);
    }
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
        <Text style={styles.valueText}>Sleep at: {formatTime(sleepTime)}</Text>
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
        <Text style={styles.valueText}>Wake up at: {formatTime(wakeTime)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onSaveTimes} disabled={!isSaveEnabled || isSaving}>
        {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

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
    backgroundColor: '#f7f9fc',  // A lighter, more neutral background color
  },
  section: {
    marginBottom: 20,
    padding: 15,  // Increased padding for better spacing
    backgroundColor: '#ffffff',
    borderRadius: 12,  // More pronounced rounded corners
    borderWidth: 1,
    borderColor: '#dfe1e5',  // Softer border color
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,  // Softer shadow for a subtle depth effect
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontSize: 20,  // Slightly larger font for better readability
    fontWeight: '600',  // Medium-bold weight
    marginBottom: 12,  // Increased space between label and content
    color: '#2c3e50',  // Darker color for better readability
  },
  valueText: {
    fontSize: 18,  // Larger font size for better visibility
    color: '#34495e',  // A softer, more pleasant color
    marginBottom: 10,  // More space below the text for clarity
  },
  button: {
    backgroundColor: '#3498db',  // A fresh, vibrant blue
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,  // More rounded corners
    marginBottom: 15,  // More space below the button
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,  // Increased font size for button text
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,  // Rounded corners for the picker as well
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});

export default SettingsScreen;