import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import MedicationListScreen from "../screens/MedicationListScreen";
import MedicationDetailScreen from "../screens/MedicationDetailScreen";
import CalculatorScreen from "../screens/CalculatorScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1B7A5A" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="MedicationList"
        component={MedicationListScreen}
        options={({ navigation }) => ({
          title: "VetDose",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Calculator")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ fontSize: 22 }}>🧮</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: "Fiche médicament" }}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: "Calculatrice",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
