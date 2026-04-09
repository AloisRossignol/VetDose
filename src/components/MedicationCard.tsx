import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Medication } from "../types";
import { COLORS, FONTS, formatFrequence } from "../theme";

interface Props {
  medication: Medication;
  onPress: () => void;
}

export default function MedicationCard({ medication, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="pill" size={18} color={COLORS.primary} />
        </View>
        <View style={styles.body}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{medication.nom}</Text>
            {medication.alias_de && (
              <View style={styles.aliasBadge}>
                <Text style={styles.aliasText}>alias</Text>
              </View>
            )}
          </View>
          <View style={styles.footer}>
            {formatFrequence(medication.frequence) && (
              <Text style={styles.frequence}>{formatFrequence(medication.frequence)}</Text>
            )}
            {medication.voies_administration.map((v) => (
              <View key={v} style={styles.tag}>
                <Text style={styles.tagText}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.border} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#0A5C38",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    gap: 5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  name: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  aliasBadge: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  aliasText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    alignItems: "center",
  },
  frequence: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  tag: {
    backgroundColor: "#F0F4F2",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});
