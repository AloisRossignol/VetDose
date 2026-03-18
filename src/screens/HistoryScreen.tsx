import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHistory } from "../hooks/useHistory";
import { formatNumber } from "../utils/calculations";

const ESPECE_LABELS: Record<string, string> = {
  chien: "Chien",
  chat: "Chat",
  lapin: "Lapin",
  furet: "Furet",
  rongeur: "Rongeur",
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { entries, clearHistory } = useHistory();

  if (entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.empty}>Aucun calcul dans l'historique</Text>
        <Text style={styles.emptyHint}>
          Les calculs effectués apparaîtront ici
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const r = item.result;
          const hasVolume = r.volume_min != null;
          const mainValue = hasVolume
            ? r.is_range
              ? `${formatNumber(r.volume_min!)} – ${formatNumber(r.volume_max!)} ml`
              : `${formatNumber(r.volume_min!)} ml`
            : r.is_range
              ? `${r.nb_comprimes_min} – ${r.nb_comprimes_max} cp`
              : `${r.nb_comprimes_min} cp`;

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.medName}>{item.medication_name}</Text>
                <Text style={styles.time}>
                  {new Date(item.timestamp).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <Text style={styles.details}>
                {ESPECE_LABELS[item.espece]} · {item.poids} kg · {item.voie}
              </Text>
              <Text style={styles.resultValue}>{mainValue}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
      <TouchableOpacity style={[styles.clearBtn, { bottom: 20 + insets.bottom }]} onPress={clearHistory}>
        <Text style={styles.clearText}>Effacer l'historique</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  empty: { fontSize: 16, fontWeight: "600", color: "#666" },
  emptyHint: { fontSize: 13, color: "#999", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  medName: { fontSize: 15, fontWeight: "700", color: "#1B7A5A" },
  time: { fontSize: 12, color: "#aaa" },
  details: { fontSize: 13, color: "#777", marginBottom: 6 },
  resultValue: { fontSize: 20, fontWeight: "800", color: "#1B7A5A" },
  clearBtn: {
    position: "absolute",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D32F2F",
  },
  clearText: { color: "#D32F2F", fontWeight: "600", fontSize: 14 },
});
