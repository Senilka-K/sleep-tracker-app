import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const SleepStatisticsScreen = () => {
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sleepQuality, setSleepQuality] = useState('Unknown');
  const [sleepDurations, setSleepDurations] = useState([]);

  useEffect(() => {
    const initializeData = async () => {
      const fetchedUserId = await getUserId();
      setUserId(fetchedUserId);
      if (fetchedUserId) {
        fetchSleepData(fetchedUserId);
      }
    };

    initializeData();
  }, []);

  const categorizeSleepQuality = (quality) => {
    if (quality >= 9) {
      return 'Good';
    } else if (quality >= 7) {
      return 'Fair';
    } else {
      return 'Poor';
    }
  };

  const fetchSleepData = async (userId) => {
    try {
      const response = await fetch(`${NGROK_STATIC_DOMAIN}/sleep-quality/${userId}`);
      const json = await response.json();
      if (response.ok) {
        setSleepDurations(json.lastSleepData.map(data => ({
          quality: categorizeSleepQuality(data.sleepQuality),
          duration: Number(data.durationHours),
          date: data.sleepDate 
        })));
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Failed to fetch sleep data:", error);
      setSleepQuality('Error fetching data');
    }
  };

  const handleDataPointClick = (dataIndex) => {
    const sleepData = sleepDurations[dataIndex];
    if (sleepData) {
      setSleepQuality(sleepData.quality);
      setDate(new Date(sleepData.date));
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#f8f8f8",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1, // optional, defaults to 2dp
    useShadowColorFromDataset: false // optional
  };

  const lineChartData = {
    labels: sleepDurations.map((_, i) => (i + 1).toString()),
    datasets: [{
      data: sleepDurations.map(data => data.duration),
      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sleep Journal</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateDisplay}>Date: {date.toISOString().substring(0, 10)}</Text>
      </View>

      <Text style={styles.subtitle}>Sleep Quality</Text>
      <Text style={styles.sleepQuality}>{sleepQuality}</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          width={320}
          height={220}
          chartConfig={chartConfig}
          bezier
          onDataPointClick={({ index }) => handleDataPointClick(index)}
        />
        <Text style={styles.axisLabel}>Your Last {sleepDurations.length} Naps</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff', // A soothing light blue that's easy on the eyes at night
  },
  header: {
    fontSize: 36, // Slightly smaller for subtlety
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e', // A dark blue color for elegance
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Use space-between to align button to the right
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10, // Add horizontal padding
  },
  dateDisplay: {
    fontSize: 24,
    color: '#2c3e50', // A deeper shade of blue for contrast
    flex: 1, // Allow text to take up remaining space
  },
  subtitle: {
    fontSize: 26, // Slightly reduced size for a balanced look
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600", // Semi-bold for importance without overpowering
  },
  sleepQuality: {
    fontSize: 20,
    color: '#16a085', // A teal color to highlight the sleep quality
    marginBottom: 30,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: 'center',
    padding: 20, // Add padding to give space around the chart
    backgroundColor: '#ffffff', // White background to make the chart stand out
    borderRadius: 10, // Rounded corners for the chart container
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Lighter shadow for subtlety
    shadowRadius: 8,
    elevation: 5,
  },
  axisLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
});

export default SleepStatisticsScreen;

