import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "./types";
import MedicationListScreen from "../screens/MedicationListScreen";
import MedicationDetailScreen from "../screens/MedicationDetailScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import { COLORS, FONTS } from "../theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

function HeaderLogo() {
  return (
    <View style={styles.headerTitle}>
      <View style={styles.logoBadge}>
        <MaterialCommunityIcons name="paw" size={15} color={COLORS.primary} />
      </View>
      <Text style={styles.headerText}>VetDose</Text>
    </View>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontFamily: FONTS.bold, fontSize: 17 },
        headerShadowVisible: false,
        headerStatusBarHeight: 0,
      }}
    >
      <Stack.Screen
        name="MedicationList"
        component={MedicationListScreen}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderLogo />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Calculator")}
              style={styles.calcBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="calculator-variant-outline" size={22} color="#fff" />
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
        options={{ title: "Calculatrice", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: "#fff",
    letterSpacing: 0.3,
  },
  calcBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
