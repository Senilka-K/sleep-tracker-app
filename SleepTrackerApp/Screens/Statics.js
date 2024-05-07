import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

const SleepStatisticsScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Define hardcoded data map
  const dateToDataMap = {
    '2024-04-30': { quality: 'Poor', data: [10, 20, 30, 40, 50] },
    '2024-05-01': { quality: 'Fair', data: [20, 45, 28, 80, 99, 43] },
    '2024-05-02': { quality: 'Good', data: [60, 70, 75, 50, 30, 20] }
  };

  // Function to retrieve data and quality based on the date
  const getDataForDate = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    return dateToDataMap[formattedDate] || {
      quality: 'Unknown',
      data: [0, 0, 0, 0]  // Provide a default data set
    };
  };

  const [chartData, setChartData] = useState(getDataForDate(new Date())); // Initialize with default data

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setChartData(getDataForDate(currentDate)); // Update data when date changes
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#f8f8f8",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Now black for better visibility
    strokeWidth: 2
  };

  const lineChartData = {
    labels: ["10 PM", "12 AM", "2 AM", "4 AM", "6 AM"], // Adjust as needed
    datasets: [
      {
        data: chartData.data,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Adjusted for better visibility in light theme
        strokeWidth: 2
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sleep Journal</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateDisplay}>Date: {formatDate(date)}</Text>
        <Button title="Pick Date" onPress={() => setShowDatePicker(true)} color="#6200EE" />
      </View>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.subtitle}>Sleep Quality</Text>
      <Text style={styles.sleepQuality}>{chartData.quality}</Text>

      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          width={300}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
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
});

export default SleepStatisticsScreen;

