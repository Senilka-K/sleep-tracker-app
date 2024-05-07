import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./Screens/Home";
import ApplicationForm from "./Screens/Form";
import SleepTimeSelector from "./Screens/SleepTime";
import WakeTimeSelector from "./Screens/WakeUpTime";
import Buttons from "./Screens/Buttons";
import SettingsScreen from "./Screens/Personalize";
import SleepStatisticsScreen from "./Screens/Statics";
import Ionicons from "@expo/vector-icons/Ionicons";

// import { useState } from "react";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Buttons" component={Buttons} options={{ title: 'Select Option' }} />
        <Stack.Screen name="ApplicationForm" component={ApplicationForm} options={{ title: 'Application Form' }} />
        <Stack.Screen name="SleepTimeSelector" component={SleepTimeSelector} options={{ title: 'Sleep Time' }} />
        <Stack.Screen name="WakeTimeSelector" component={WakeTimeSelector} options={{ title: 'Wake Time' }} />
      </Stack.Navigator>
      {/* <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: "below-icon",
          tabBarShowLabel: true,
          tabBarActiveTintColor: "purple",
        }}
      >
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarLabel: "home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={20} color={color} />
            ),
          }}
        /> */}
        {/* <Tab.Screen
            name="Form"
            component={ApplicationForm}
            options={{
              tabBarLabel: "Form",
              tabBarIcon: ({ color }) => (
                <Ionicons name="apps-outline" size={20} color={color} />
              ),
            }}
          /> */}
          {/* <Tab.Screen
            name="Sleep Time"
            component={SleepTimeSelector}
            options={{
              tabBarLabel: "Sleep",
              tabBarIcon: ({ color }) => (
                <Ionicons name="alarm" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Wake Up Time"
            component={WakeTimeSelector}
            options={{
              tabBarLabel: "Wake Up",
              tabBarIcon: ({ color }) => (
                <Ionicons name="alarm" size={20} color={color} />
              ),
            }}
          /> */}
          {/* <Tab.Screen
            name="Selection"
            component={Buttons}
            options={{
              tabBarLabel: "Selection",
              tabBarIcon: ({ color }) => (
                <Ionicons name="checkmark-circle" size={20} color={color} />
              ),
            }}
          /> */}
          {/* <Tab.Screen
            name="Personalize"
            component={SettingsScreen}
            options={{
              tabBarLabel: "Personalize",
              tabBarIcon: ({ color }) => (
                <Ionicons name="person-circle" size={20} color={color} />
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
      </Tab.Navigator> */}
    </NavigationContainer>
);
}

