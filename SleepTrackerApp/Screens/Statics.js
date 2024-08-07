import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { NGROK_STATIC_DOMAIN } from '@env';
import { getUserId } from '../UserIdStore';

const SleepStatisticsScreen = () => {
  const [date, setDate] = useState(new Date());
  const [userId, setUserId] = useState(null);
  const [sleepQuality, setSleepQuality] = useState('');
  const [sleepDurations, setSleepDurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const validDurations = json.lastSleepData.map(data => ({
          quality: categorizeSleepQuality(data.sleepQuality),
          duration: Number(data.durationHours),
          date: data.sleepDate
        })).filter(data => isFinite(data.duration));

        setSleepDurations(validDurations);
      } else {
        throw new Error(json.message);
      }
    } catch (error) {
      console.error("Failed to fetch sleep data:", error);
      setSleepQuality('Error fetching data');
      setError(error.message);
    } finally {
      setLoading(false);  
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
    decimalPlaces: 2,
    useShadowColorFromDataset: false 
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
    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <>
        <View style={styles.dateContainer}>
          <Text style={styles.dateDisplay}>Date: {date.toISOString().substring(0, 10)}</Text>
        </View>
        <Text style={styles.subtitle}>Sleep Quality</Text>
        <Text style={styles.sleepQuality}>{sleepQuality}</Text>
        <View style={styles.chartContainer}>
          {sleepDurations.length > 0 ? (
            <LineChart
              data={lineChartData}
              width={320}
              height={220}
              chartConfig={chartConfig}
              bezier
              onDataPointClick={({ index }) => handleDataPointClick(index)}
            />
          ) : (
            <Text>No sleep data available.</Text>
          )}
          <Text style={styles.axisLabel}>Your Last {sleepDurations.length} Naps</Text>
        </View>
      </>
    )}
    {error && <Text style={styles.errorText}>Error: {error}</Text>}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f9ff', 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  header: {
    fontSize: 36, 
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: "bold",
    color: '#34495e',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10, 
  },
  dateDisplay: {
    fontSize: 24,
    color: '#2c3e50', 
    flex: 1, 
  },
  subtitle: {
    fontSize: 26,
    color: '#2c3e50',
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  sleepQuality: {
    fontSize: 20,
    color: '#16a085', 
    marginBottom: 30,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: 'center',
    padding: 20, 
    backgroundColor: '#ffffff',
    borderRadius: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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

