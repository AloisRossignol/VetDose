import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Medication } from "../types";

interface Props {
  medication: Medication;
  onPress: () => void;
}

export default function MedicationCard({ medication, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.name}>{medication.nom}</Text>
      <View style={styles.footer}>
        {medication.frequence && (
          <Text style={styles.frequence}>{medication.frequence}</Text>
        )}
        {medication.voies_administration.map((v) => (
          <View key={v} style={styles.tag}>
            <Text style={styles.tagText}>{v}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B7A5A",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  frequence: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  tag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "500",
  },
});
