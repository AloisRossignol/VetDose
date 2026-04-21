import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  values: number[];
  selected: number | null;
  onSelect: (value: number) => void;
  label: string;
  unit: string;
}

export default function ConcentrationBadge({
  values,
  selected,
  onSelect,
  label,
  unit,
}: Props) {
  if (values.length === 0) return null;

  if (values.length === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.singleValue}>{values[0]} {unit}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.badges}>
        {values.map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.badge, selected === v && styles.badgeActive]}
            onPress={() => onSelect(v)}
          >
            <Text style={[styles.badgeText, selected === v && styles.badgeTextActive]}>
              {v} {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  badgeActive: {
    backgroundColor: "#1976D2",
    borderColor: "#1976D2",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  badgeTextActive: {
    color: "#fff",
  },
  singleValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
