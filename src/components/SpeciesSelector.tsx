import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Espece } from "../types";

const ESPECE_LABELS: Record<Espece, string> = {
  chien: "Chien",
  chat: "Chat",
  lapin: "Lapin",
  furet: "Furet",
  rongeur: "Rongeur",
};

interface Props {
  especes: Espece[];
  selected: Espece | null;
  onSelect: (espece: Espece) => void;
}

export default function SpeciesSelector({ especes, selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Espèce</Text>
      <View style={styles.badges}>
        {especes.map((e) => (
          <TouchableOpacity
            key={e}
            style={[styles.badge, selected === e && styles.badgeActive]}
            onPress={() => onSelect(e)}
          >
            <Text style={[styles.badgeText, selected === e && styles.badgeTextActive]}>
              {ESPECE_LABELS[e]}
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
    backgroundColor: "#1B7A5A",
    borderColor: "#1B7A5A",
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  badgeTextActive: {
    color: "#fff",
  },
});
