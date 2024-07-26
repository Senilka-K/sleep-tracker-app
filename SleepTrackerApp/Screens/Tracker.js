// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
// import { NGROK_STATIC_DOMAIN } from '@env';
// import { getUserId } from '../UserIdStore';
// import * as Notifications from 'expo-notifications';

// const SleepTracker = () => {
//   const [isSleeping, setIsSleeping] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [currentTime, setCurrentTime] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [sleepTime, setSleepTime] = useState(null);
//   const [wakeTime, setWakeTime] = useState(null);

//   useEffect(() => {
//     Notifications.setNotificationHandler({
//       handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//       }),
//     });

//     return () => {
//       Notifications.removeAllNotificationListeners();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const fetchedUserId = await getUserId();
//         if (!fetchedUserId) throw new Error('User ID not found');

//         setUserId(fetchedUserId);

//         const response = await fetch(`${NGROK_STATIC_DOMAIN}/times/${fetchedUserId}`);
//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Failed to fetch times');

//         const fetchedSleepTime = new Date(data.sleepTime);
//         const fetchedWakeTime = new Date(data.wakeUpTime);
//         setSleepTime(fetchedSleepTime);
//         setWakeTime(fetchedWakeTime);

//         // Schedule notifications
//         scheduleNotification(fetchedSleepTime, 'Time to sleep!');
//         scheduleNotification(fetchedWakeTime, 'Good morning! Time to wake up!');
//       } catch (error) {
//         Alert.alert('Error', `Failed to fetch times: ${error.message}`);
//       }
//     };

//     fetchData();
//   }, []);

//   const scheduleNotification = async (time, message) => {
//     const schedulingOptions = {
//       content: {
//         title: "Alarm",
//         body: message,
//         sound: true, // Ensure the sound is enabled in app settings for iOS
//       },
//       trigger: time,
//     };

//     await Notifications.scheduleNotificationAsync(schedulingOptions);
//   };
  
//   // useEffect(() => {
//   //   let interval = null;
//   //   if (isSleeping) {
//   //     setStartTime(new Date());
//   //     interval = setInterval(() => {
//   //       setCurrentTime(new Date());
//   //     }, 1000);  // Update the current time every second
//   //   } else if (!isSleeping && startTime) {
//   //     clearInterval(interval);
//   //     const sleepDuration = new Date() - startTime;
//   //     console.log(`You slept for ${sleepDuration / 1000} seconds.`);
//   //     setCurrentTime(null);  // Reset current time
//   //   }
//   //   return () => clearInterval(interval);
//   // }, [isSleeping]);

//   // const handleSleepToggle = () => {
//   //   setIsSleeping(!isSleeping);
//   // };

//   return (
//     <View style={styles.container}>
//       {/* <TouchableOpacity style={styles.button} onPress={handleSleepToggle}>
//         <Text style={styles.buttonText}>{isSleeping ? 'Wake Up Now' : 'Sleep Now'}</Text>
//       </TouchableOpacity>
//       {currentTime && (
//         <Text style={styles.timerText}>
//           Sleeping Time: {(currentTime - startTime) / 1000} seconds
//         </Text>
//       )} */}
//       <Text>Sleep</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e8f4f8',  // A light calming blue background
//   },
//   button: {
//     backgroundColor: '#4CAF50',  // Green button background
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 10,  // More pronounced rounded corners
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 7,
//     marginBottom: 20,  // Space between the button and timer text
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',  // Stylistic choice for uppercase text
//   },
//   timerText: {
//     marginTop: 10,
//     fontSize: 20,  // Larger font for better readability
//     color: '#333',
//     fontWeight: '500',  // Medium weight for the timer text
//     paddingHorizontal: 20,  // Horizontal padding to keep the text centered
//     backgroundColor: '#ffffff',  // Light background for timer text
//     borderRadius: 10,  // Rounded corners for the timer display
//     paddingVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 3.84,
//     elevation: 4,
//   },
// });

// export default SleepTracker;

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const SleepTracker = () => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepStartTime, setSleepStartTime] = useState(null);
  const [sleepDuration, setSleepDuration] = useState('');

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
      if (!response.ok) throw new Error('Failed to record wake time');
      const data = await response.json();
      setIsSleeping(false);
      setSleepDuration(`${new Date(data.sleepDuration).getUTCHours()} hours, ${new Date(data.sleepDuration).getUTCMinutes()} minutes`);
    } catch (error) {
      console.error('Error recording wake time:', error.message);
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notifications are dynamically set based on server data.</Text>
      <TouchableOpacity onPress={toggleSleep} style={{ marginTop: 20, padding: 10, backgroundColor: '#007AFF' }}>
        <Text style={{ color: 'white' }}>{isSleeping ? 'Wake Up Now' : 'Sleep Now'}</Text>
      </TouchableOpacity>
      <Text>Sleep Duration: {sleepDuration}</Text>
    </View>
  );
};

export default SleepTracker;
