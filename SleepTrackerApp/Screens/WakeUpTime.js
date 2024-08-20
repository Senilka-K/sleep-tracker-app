import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const WakeTimeSelector = ( { navigation } ) => {
  const [wakeTime, setWakeTime] = useState(new Date());
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const fetchedUserId = await getUserId();
      setUserId(fetchedUserId);
    };

    fetchUserId();
  }, []);

  const onChangeWake = (event, selectedDate) => {
    const currentDate = selectedDate || wakeTime;
    setWakeTime(currentDate);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const saveWakeUpTime = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/update-wake-up-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, wakeUpTime: wakeTime.toISOString() })
      });
      const data = await response.json();
      if (response.status === 200) {
        Alert.alert('Success', 'Wake up time saved successfully');
        navigation.navigate('Buttons');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to save wake up time: ${error.message}`);
    }
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
      <Text style={styles.timeText}>Wake up at: {formatTime(wakeTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f9ff',
  },
  pickerContainer: {
    width: '80%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
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
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
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
    fontSize: 20,
    color: "#fff",
    fontWeight: 'bold',
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
