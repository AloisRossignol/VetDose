import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import TabNavigator from "./TabNavigator";
import MedicationDetailScreen from "../screens/MedicationDetailScreen";
import MedicationEditScreen from "../screens/MedicationEditScreen";

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
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: "Fiche médicament" }}
      />
      <Stack.Screen
        name="MedicationEdit"
        component={MedicationEditScreen}
        options={({ route }) => ({
          title: route.params?.medicationId
            ? "Modifier médicament"
            : "Nouveau médicament",
        })}
      />
    </Stack.Navigator>
  );
}
