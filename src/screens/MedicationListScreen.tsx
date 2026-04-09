import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMedications } from "../hooks/useMedications";
import MedicationCard from "../components/MedicationCard";
import { COLORS, FONTS } from "../theme";
import type { RootStackScreenProps } from "../navigation/types";

export default function MedicationListScreen({
  navigation,
}: RootStackScreenProps<"MedicationList">) {
  const [search, setSearch] = useState("");
  const { data: medications = [], isLoading } = useMedications();

  const filtered = useMemo(() => {
    if (!search.trim()) return medications;
    const q = search.toLowerCase().trim();
    return medications.filter((m) => m.nom.toLowerCase().includes(q));
  }, [medications, search]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <MaterialCommunityIcons name="magnify" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un médicament..."
          placeholderTextColor={COLORS.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <MaterialCommunityIcons
            name="close-circle"
            size={16}
            color={COLORS.textSecondary}
            onPress={() => setSearch("")}
          />
        )}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        renderItem={({ item: med }) => (
          <MedicationCard
            medication={med}
            onPress={() => navigation.navigate("MedicationDetail", {
              medicationId: med.alias_de ?? med.id,
              defaultVoie: med.alias_de && med.voies_administration.length === 1
                ? med.voies_administration[0]
                : undefined,
            })}
          />
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <MaterialCommunityIcons name="pill-off" size={40} color={COLORS.border} />
            <Text style={styles.empty}>Aucun médicament trouvé</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#0A5C38",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  emptyWrapper: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});
