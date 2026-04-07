import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useMedications } from "../hooks/useMedications";
import MedicationCard from "../components/MedicationCard";
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
        <ActivityIndicator size="large" color="#1B7A5A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un médicament..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        renderItem={({ item: med }) => (
          <MedicationCard
            medication={med}
            onPress={() =>
              navigation.navigate("MedicationDetail", {
                medicationId: med.id,
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun médicament trouvé</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchBar: {
    backgroundColor: "#fff",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
  },
});
