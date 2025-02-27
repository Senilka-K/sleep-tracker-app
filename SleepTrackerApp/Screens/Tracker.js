import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const SleepTracker = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);

  useEffect(() => {
    requestPermissions();
    setupNotifications();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowSound: true,
      },
    });
    if (status !== 'granted') {
      alert('You need to enable notifications for this app to function properly!');
      return;
    }
  };

  const setupNotifications = async () => {
    try {
      const fetchedUserId = await getUserId();
      if (fetchedUserId) {
        fetchUserTimesAndScheduleNotifications(fetchedUserId);
      } else {
        console.error('Failed to fetch user ID');
      }
    } catch (error) {
      console.error('Error obtaining user ID:', error);
    }
  };

  const fetchUserTimesAndScheduleNotifications = async (userId) => {
    try {
      const url = `${NGROK_STATIC_DOMAIN}/times/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { sleepTime, wakeUpTime } = await response.json();
      console.log("Fetched times:", sleepTime, wakeUpTime); 
  
      const sleepTimeDate = new Date(sleepTime);
      const wakeTimeDate = new Date(wakeUpTime);
  
      console.log("Parsed times:", sleepTimeDate, wakeTimeDate); 
  
      await scheduleNotification(sleepTimeDate.getHours(), sleepTimeDate.getMinutes(), "Good Night", "Time to sleep.");
      await scheduleNotification(wakeTimeDate.getHours(), wakeTimeDate.getMinutes(), "Good Morning", "Time to wake up.");
    } catch (error) {
      console.error('Error fetching or scheduling times:', error);
    }
  };

  const scheduleNotification = async (hour, minute, title, body) => {
    const schedulingOptions = {
      content: {
        title,
        body,
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      }
    };

    await Notifications.scheduleNotificationAsync(schedulingOptions);
    console.log(`Notification scheduled for ${hour}:${minute} every day`);
  };

  const toggleSleep = async () => {
    const userId = await getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    if (isSleeping) {
      recordWakeTime(userId);
    } else {
      recordSleepTime(userId);
    }
  };

  const recordSleepTime = async (userId) => {
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/sleep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to record sleep time');
      setIsSleeping(true);
    } catch (error) {
      console.error('Error recording sleep time:', error.message);
    }
  };

  const recordWakeTime = async (userId) => {
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/wake/${userId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to record wake time');
      
      setIsSleeping(false);  

    } catch (error) {
      console.error('Error recording wake time:', error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Time to Sleep!</Text>
      <Text style={styles.subHeader}>Dream Beautifully.</Text>
      <TouchableOpacity onPress={toggleSleep} style={styles.button}>
        <Text style={styles.buttonText}>{isSleeping ? 'Wake Up Now' : 'Sleep Now'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',  
  },
  header: {
    fontSize: 48, 
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  subHeader: {
    fontSize: 30,
    marginBottom: 60,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', 
  },
  button: {
    backgroundColor: '#3498db',  
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,  
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase', 
  },
})

export default SleepTracker;
