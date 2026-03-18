import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Medication, Espece } from "../types";

const ESPECE_LABELS: Record<Espece, string> = {
  chien: "Chien",
  chat: "Chat",
  lapin: "Lapin",
  furet: "Furet",
  rongeur: "Rongeur",
};

interface Props {
  medication: Medication;
  especes: Espece[];
  onPress: () => void;
}

export default function MedicationCard({ medication, especes, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name}>{medication.nom_commercial}</Text>
        <Text style={styles.famille}>{medication.famille}</Text>
      </View>
      <Text style={styles.dci}>{medication.dci}</Text>
      <View style={styles.tags}>
        {especes.map((e) => (
          <View key={e} style={styles.tag}>
            <Text style={styles.tagText}>{ESPECE_LABELS[e]}</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B7A5A",
    flex: 1,
  },
  famille: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  dci: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
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
