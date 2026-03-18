import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMedications } from "../hooks/useMedications";
import { usePosologiesForMedication } from "../hooks/usePosologies";
import { getEspecesForMedication } from "../data/repository";
import MedicationCard from "../components/MedicationCard";
import { Medication, Espece } from "../types";
import type { TabScreenProps } from "../navigation/types";
import { useQuery } from "@tanstack/react-query";

function useAllEspeces(medications: Medication[]) {
  return useQuery({
    queryKey: ["all-especes", medications.map((m) => m.id)],
    queryFn: async () => {
      const result: Record<string, Espece[]> = {};
      for (const med of medications) {
        result[med.id] = await getEspecesForMedication(med.id);
      }
      return result;
    },
    enabled: medications.length > 0,
  });
}

export default function MedicationListScreen({
  navigation,
}: TabScreenProps<"Medications">) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const { data: medications = [], isLoading } = useMedications();
  const { data: especesMap = {} } = useAllEspeces(medications);

  const filtered = useMemo(() => {
    if (!search.trim()) return medications;
    const q = search.toLowerCase().trim();
    return medications.filter(
      (m) =>
        m.nom_commercial.toLowerCase().includes(q) ||
        m.dci.toLowerCase().includes(q) ||
        m.famille.toLowerCase().includes(q)
    );
  }, [medications, search]);

  // Group by famille
  const grouped = useMemo(() => {
    const groups: Record<string, Medication[]> = {};
    for (const med of filtered) {
      if (!groups[med.famille]) groups[med.famille] = [];
      groups[med.famille].push(med);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

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
        placeholder="Rechercher par nom, DCI ou famille..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FlatList
        data={grouped}
        keyExtractor={([famille]) => famille}
        renderItem={({ item: [famille, meds] }) => (
          <View>
            <Text style={styles.sectionHeader}>{famille}</Text>
            {meds.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                especes={especesMap[med.id] || []}
                onPress={() =>
                  navigation.navigate("MedicationDetail", {
                    medicationId: med.id,
                  })
                }
              />
            ))}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun médicament trouvé</Text>
        }
      />
      {/* FAB admin — always visible for now (no auth in stub) */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        onPress={() => navigation.navigate("MedicationEdit", {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1B7A5A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "300",
    marginTop: -2,
  },
});
