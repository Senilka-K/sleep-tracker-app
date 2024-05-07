import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Screens/Home";
import ApplicationForm from "./Screens/Form";
import SleepTimeSelector from "./Screens/SleepTime";
import WakeTimeSelector from "./Screens/WakeUpTime";
import Buttons from "./Screens/Buttons";
import SettingsScreen from "./Screens/Personalize";
import ApplicationFormEditable from "./Screens/Profile";
import SleepTracker from "./Screens/Tracker";
import SleepStatisticsScreen from "./Screens/Statics";
import Ionicons from "@expo/vector-icons/Ionicons";

// import { useState } from "react";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "purple",
      }}
    >
      <Tab.Screen
        name="Tracker"
        component={SleepTracker}
        options={{
          tabBarLabel: "Tracker",
          tabBarIcon: ({ color }) => (
            <Ionicons name="walk" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Personalize"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Personalize",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statics"
        component={SleepStatisticsScreen}
        options={{
          tabBarLabel: "Statics",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ApplicationFormEditable}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {

return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Buttons" component={Buttons} options={{ title: 'Select Option' }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Application Form' }} />
        <Stack.Screen name="SleepTimeSelector" component={SleepTimeSelector} options={{ title: 'Sleep Time' }} />
        <Stack.Screen name="WakeTimeSelector" component={WakeTimeSelector} options={{ title: 'Wake Time' }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
);
}

