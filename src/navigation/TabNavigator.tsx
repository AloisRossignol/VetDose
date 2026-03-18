import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabParamList } from "./types";
import MedicationListScreen from "../screens/MedicationListScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    "Médicaments": "💊",
    Calculatrice: "🧮",
    Historique: "📋",
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || "•"}
    </Text>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1B7A5A" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: "#1B7A5A",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          paddingBottom: insets.bottom + 4,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Medications"
        component={MedicationListScreen}
        options={{
          title: "Médicaments",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Médicaments" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: "Calculatrice",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Calculatrice" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Historique",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Historique" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
