import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CalculationResult } from "../types";
import { formatNumber } from "../utils/calculations";

interface Props {
  result: CalculationResult;
  unite: string;
}

export default function DoseResult({ result, unite }: Props) {
  const hasVolume = result.volume_min != null;
  const hasComprimes = result.nb_comprimes_min != null;

  return (
    <View style={styles.container}>
      {/* Volume */}
      {hasVolume && (
        <View style={styles.mainResult}>
          <Text style={styles.mainLabel}>Volume à administrer</Text>
          <Text style={styles.mainValue}>
            {result.is_range
              ? `${formatNumber(result.volume_min!)} – ${formatNumber(result.volume_max!)} ml`
              : `${formatNumber(result.volume_min!)} ml`}
          </Text>
        </View>
      )}

      {/* Comprimés */}
      {hasComprimes && (
        <View style={styles.mainResult}>
          <Text style={styles.mainLabel}>Nombre de comprimés</Text>
          <Text style={styles.mainValue}>
            {result.is_range
              ? `${result.nb_comprimes_min} – ${result.nb_comprimes_max} cp`
              : `${result.nb_comprimes_min} cp`}
          </Text>
        </View>
      )}

      {/* Dose totale */}
      <View style={styles.secondary}>
        <Text style={styles.secondaryLabel}>Dose totale</Text>
        <Text style={styles.secondaryValue}>
          {result.is_range
            ? `${formatNumber(result.dose_totale_min)} – ${formatNumber(result.dose_totale_max)} ${unite.replace("/kg", "")}`
            : `${formatNumber(result.dose_totale_min)} ${unite.replace("/kg", "")}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  mainResult: {
    alignItems: "center",
    marginBottom: 12,
  },
  mainLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B7A5A",
  },
  secondary: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#C8E6C9",
    paddingTop: 10,
  },
  secondaryLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 2,
  },
  secondaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
