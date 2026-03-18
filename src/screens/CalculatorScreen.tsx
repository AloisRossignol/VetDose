import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { quickCalculate, formatNumber } from "../utils/calculations";

export default function CalculatorScreen() {
  const [dose, setDose] = useState("");
  const [poids, setPoids] = useState("");
  const [concentration, setConcentration] = useState("");

  const doseNum = parseFloat(dose.replace(",", "."));
  const poidsNum = parseFloat(poids.replace(",", "."));
  const concNum = parseFloat(concentration.replace(",", "."));

  const allValid =
    !isNaN(doseNum) &&
    doseNum > 0 &&
    !isNaN(poidsNum) &&
    poidsNum >= 0.01 &&
    poidsNum <= 150 &&
    !isNaN(concNum) &&
    concNum > 0;

  const result = useMemo(() => {
    if (!allValid) return null;
    return quickCalculate(doseNum, poidsNum, concNum);
  }, [doseNum, poidsNum, concNum, allValid]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitle}>
          Calcul libre sans fiche médicament
        </Text>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dose (mg/kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : 0.2"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
              value={dose}
              onChangeText={setDose}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poids de l'animal (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : 25"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
              value={poids}
              onChangeText={setPoids}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Concentration (mg/ml)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : 5"
              placeholderTextColor="#bbb"
              keyboardType="decimal-pad"
              value={concentration}
              onChangeText={setConcentration}
            />
          </View>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultMain}>
              <Text style={styles.resultLabel}>Volume à administrer</Text>
              <Text style={styles.resultValue}>
                {formatNumber(result.volume)} ml
              </Text>
            </View>
            <View style={styles.resultSecondary}>
              <Text style={styles.secondaryLabel}>Dose totale</Text>
              <Text style={styles.secondaryValue}>
                {formatNumber(result.dose_totale)} mg
              </Text>
            </View>
          </View>
        )}

        {!result && dose.length > 0 && poids.length > 0 && concentration.length > 0 && (
          <Text style={styles.hint}>
            Vérifiez les valeurs saisies.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
  },
  resultMain: { alignItems: "center", marginBottom: 12 },
  resultLabel: { fontSize: 14, color: "#555", marginBottom: 4 },
  resultValue: { fontSize: 32, fontWeight: "800", color: "#1B7A5A" },
  resultSecondary: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#C8E6C9",
    paddingTop: 10,
  },
  secondaryLabel: { fontSize: 13, color: "#777", marginBottom: 2 },
  secondaryValue: { fontSize: 16, fontWeight: "600", color: "#333" },
  hint: {
    textAlign: "center",
    color: "#999",
    marginTop: 16,
    fontSize: 14,
  },
});
