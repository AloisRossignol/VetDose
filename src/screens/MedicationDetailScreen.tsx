import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMedication } from "../hooks/useMedications";
import {
  useEspecesForMedication,
  usePosologie,
} from "../hooks/usePosologies";
import { useHistory } from "../hooks/useHistory";
import SpeciesSelector from "../components/SpeciesSelector";
import ConcentrationBadge from "../components/ConcentrationBadge";
import DoseResult from "../components/DoseResult";
import { calculateDosage } from "../utils/calculations";
import { Espece, VoieAdmin } from "../types";
import type { RootStackScreenProps } from "../navigation/types";

const VOIE_LABELS: Record<VoieAdmin, string> = {
  PO: "PO (orale)",
  SC: "SC (sous-cutanée)",
  IM: "IM (intramusculaire)",
  IV: "IV (intraveineuse)",
};

export default function MedicationDetailScreen({
  route,
}: RootStackScreenProps<"MedicationDetail">) {
  const insets = useSafeAreaInsets();
  const { medicationId } = route.params;
  const { data: med, isLoading } = useMedication(medicationId);
  const { data: especes = [] } = useEspecesForMedication(medicationId);

  const [selectedEspece, setSelectedEspece] = useState<Espece | null>(null);
  const [poids, setPoids] = useState("");
  const [selectedVoie, setSelectedVoie] = useState<VoieAdmin | null>(null);
  const [selectedConcentration, setSelectedConcentration] = useState<number | null>(null);
  const [selectedDosage, setSelectedDosage] = useState<number | null>(null);

  const { data: posologie } = usePosologie(medicationId, selectedEspece);
  const { addEntry } = useHistory();

  // Toast for contre-indications
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Show toast when selecting a species with contre-indications
  useEffect(() => {
    if (
      selectedEspece &&
      med?.contre_indications &&
      med.contre_indications.length > 0
    ) {
      setToastVisible(true);
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setToastVisible(false));
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setToastVisible(false);
      toastOpacity.setValue(0);
    }
  }, [selectedEspece]);

  // Auto-select first voie / concentration
  useEffect(() => {
    if (med && !selectedVoie && med.voies_administration.length > 0) {
      setSelectedVoie(med.voies_administration[0]);
    }
    if (med && !selectedConcentration && med.concentrations.length > 0) {
      setSelectedConcentration(med.concentrations[0]);
    }
    if (med && !selectedDosage && med.dosages_comprimes && med.dosages_comprimes.length > 0) {
      setSelectedDosage(med.dosages_comprimes[0]);
    }
  }, [med]);

  const poidsNum = parseFloat(poids.replace(",", "."));
  const poidsValid = !isNaN(poidsNum) && poidsNum >= 0.01 && poidsNum <= 150;

  const result = useMemo(() => {
    if (!posologie || !poidsValid || !med) return null;

    const concentration =
      med.forme_galenique === "comprime"
        ? 0
        : selectedConcentration ?? 0;
    const dosage_comprime =
      med.forme_galenique === "comprime" ? selectedDosage ?? 0 : undefined;

    if (med.forme_galenique !== "comprime" && concentration <= 0) return null;
    if (med.forme_galenique === "comprime" && (!dosage_comprime || dosage_comprime <= 0))
      return null;

    return calculateDosage({
      espece: selectedEspece!,
      poids: poidsNum,
      voie: selectedVoie!,
      concentration,
      dose_min: posologie.dose_min,
      dose_max: posologie.dose_max,
      forme_galenique: med.forme_galenique,
      dosage_comprime,
    });
  }, [posologie, poidsNum, selectedConcentration, selectedDosage, selectedVoie, med]);

  // Save to history when result changes
  useEffect(() => {
    if (result && med && selectedEspece && selectedVoie) {
      addEntry({
        medication_name: med.nom_commercial,
        espece: selectedEspece,
        poids: poidsNum,
        voie: selectedVoie,
        concentration: selectedConcentration ?? selectedDosage ?? 0,
        result,
      });
    }
  }, [result]);

  if (isLoading || !med) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B7A5A" />
      </View>
    );
  }

  const noPosologie = selectedEspece && !posologie;

  const dismissToast = () => {
    Animated.timing(toastOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setToastVisible(false));
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{med.nom_commercial}</Text>
        <Text style={styles.dci}>{med.dci}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaTag}>{med.forme_galenique.replace("_", " ")}</Text>
          <Text style={styles.metaTag}>{med.frequence}</Text>
        </View>
      </View>

      {/* Formulaire de calcul */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calcul de posologie</Text>

        <SpeciesSelector
          especes={especes}
          selected={selectedEspece}
          onSelect={setSelectedEspece}
        />

        {noPosologie && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Aucune posologie définie pour cette espèce.
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Poids (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : 12.5"
            placeholderTextColor="#bbb"
            keyboardType="decimal-pad"
            value={poids}
            onChangeText={setPoids}
          />
          {poids.length > 0 && !poidsValid && (
            <Text style={styles.errorText}>
              Poids entre 0.01 et 150 kg
            </Text>
          )}
        </View>

        {/* Voie d'administration */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Voie d'administration</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {med.voies_administration.map((v) => (
              <Text
                key={v}
                onPress={() => setSelectedVoie(v)}
                style={[
                  styles.voieBadge,
                  selectedVoie === v && styles.voieBadgeActive,
                ]}
              >
                {VOIE_LABELS[v]}
              </Text>
            ))}
          </View>
        </View>

        {/* Concentration ou dosage comprimé */}
        {med.forme_galenique === "comprime" && med.dosages_comprimes ? (
          <ConcentrationBadge
            values={med.dosages_comprimes}
            selected={selectedDosage}
            onSelect={setSelectedDosage}
            label="Dosage du comprimé"
            unit="mg"
          />
        ) : (
          <ConcentrationBadge
            values={med.concentrations}
            selected={selectedConcentration}
            onSelect={setSelectedConcentration}
            label="Concentration"
            unit="mg/ml"
          />
        )}

        {/* Résultat */}
        {result && posologie && (
          <DoseResult result={result} unite={posologie.unite} />
        )}
      </View>
    </ScrollView>

    {/* Toast contre-indications */}
    {toastVisible && (
      <Animated.View
        style={[
          styles.toast,
          { top: insets.top + 8, opacity: toastOpacity },
        ]}
      >
        <TouchableOpacity
          style={styles.toastContent}
          onPress={dismissToast}
          activeOpacity={0.9}
        >
          <Text style={styles.toastTitle}>Contre-indications</Text>
          <Text style={styles.toastText}>{med.contre_indications}</Text>
        </TouchableOpacity>
      </Animated.View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B7A5A",
    marginBottom: 2,
  },
  dci: { fontSize: 15, color: "#666", marginBottom: 8 },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaTag: {
    fontSize: 12,
    color: "#555",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 100,
  },
  toastContent: {
    backgroundColor: "#FFF3E0",
    borderLeftWidth: 4,
    borderLeftColor: "#F57C00",
    borderRadius: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastTitle: { fontWeight: "700", color: "#E65100", marginBottom: 4, fontSize: 14 },
  toastText: { fontSize: 13, color: "#BF360C" },
  warning: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  warningText: { color: "#F57F17", fontWeight: "600", fontSize: 13 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: { color: "#D32F2F", fontSize: 12, marginTop: 4 },
  voieBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    fontSize: 13,
    color: "#555",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  voieBadgeActive: {
    backgroundColor: "#1B7A5A",
    color: "#fff",
    borderColor: "#1B7A5A",
  },
});
