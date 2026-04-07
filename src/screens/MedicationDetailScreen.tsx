import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMedication } from "../hooks/useMedications";
import {
  usePosologiesForMedication,
  useEspecesForMedication,
} from "../hooks/usePosologies";
import SpeciesSelector from "../components/SpeciesSelector";
import ConcentrationBadge from "../components/ConcentrationBadge";
import { Espece, VoieAdmin, Posologie } from "../types";
import type { RootStackScreenProps } from "../navigation/types";

const VOIE_LABELS: Record<VoieAdmin, string> = {
  PO: "PO (orale)",
  "PO CHIR": "PO CHIR (orale chirurgie)",
  SC: "SC (sous-cutanée)",
  IM: "IM (intramusculaire)",
  IV: "IV (intraveineuse)",
  IR: "IR (intrarectale)",
};

function getPosologieLabel(p: Posologie): string {
  if (p.volume_min !== null) return "Solution (ml/kg)";
  if (p.dose_min !== null) return `Comprimé (${p.unite})`;
  return "Posologie";
}

function calculateResult(
  posologie: Posologie,
  poids: number,
  concentration: number | null
): { min: number | null; max: number | null; unite: string; label: string } | null {
  if (posologie.volume_min !== null && posologie.volume_max !== null) {
    return {
      min: Math.round(posologie.volume_min * poids * 100) / 100,
      max: Math.round(posologie.volume_max * poids * 100) / 100,
      unite: "ml",
      label: "Volume à administrer",
    };
  }

  if (posologie.dose_min !== null && posologie.dose_max !== null) {
    if (!concentration || concentration <= 0) {
      return {
        min: Math.round(posologie.dose_min * poids * 100) / 100,
        max: Math.round(posologie.dose_max * poids * 100) / 100,
        unite: posologie.unite.replace("/kg", ""),
        label: "Dose à administrer",
      };
    }
    return {
      min: Math.round((posologie.dose_min * poids / concentration) * 100) / 100,
      max: Math.round((posologie.dose_max * poids / concentration) * 100) / 100,
      unite: "ml",
      label: "Volume à administrer",
    };
  }

  return null;
}

export default function MedicationDetailScreen({
  route,
}: RootStackScreenProps<"MedicationDetail">) {
  const insets = useSafeAreaInsets();
  const { medicationId } = route.params;
  const { data: med, isLoading } = useMedication(medicationId);
  const { data: posologies = [] } = usePosologiesForMedication(medicationId);
  const { data: especes = [] } = useEspecesForMedication(medicationId);

  const hasSpecies = especes.length > 0;

  const [selectedEspece, setSelectedEspece] = useState<Espece | null>(null);
  const [poids, setPoids] = useState("");
  const [selectedVoie, setSelectedVoie] = useState<VoieAdmin | null>(null);
  const [selectedConcentration, setSelectedConcentration] = useState<number | null>(null);
  const [selectedPosologieId, setSelectedPosologieId] = useState<string | null>(null);

  useEffect(() => {
    if (med && !selectedVoie && med.voies_administration.length > 0) {
      setSelectedVoie(med.voies_administration[0]);
    }
  }, [med]);

  useEffect(() => {
    if (med && !selectedConcentration && med.concentrations.length > 0) {
      setSelectedConcentration(med.concentrations[0]);
    }
  }, [med]);

  const filteredPosologies = useMemo(() => {
    if (!posologies.length) return [];

    let pool = posologies;

    // Filtre par voie d'administration
    if (selectedVoie) {
      const byVoie = pool.filter((p) => p.voie_admin === selectedVoie || p.voie_admin === null);
      if (byVoie.length > 0) pool = byVoie;
    }

    // Filtre par espèce
    if (!hasSpecies) return pool;
    if (selectedEspece) {
      const specific = pool.filter((p) => p.espece === selectedEspece);
      if (specific.length > 0) return specific;
    }
    return pool.filter((p) => p.espece === null);
  }, [posologies, selectedEspece, hasSpecies, selectedVoie]);

  useEffect(() => {
    if (filteredPosologies.length > 0) {
      setSelectedPosologieId(filteredPosologies[0].id);
    } else {
      setSelectedPosologieId(null);
    }
  }, [filteredPosologies]);

  const selectedPosologie =
    filteredPosologies.find((p) => p.id === selectedPosologieId) ?? null;

  const poidsNum = parseFloat(poids.replace(",", "."));
  const poidsValid = !isNaN(poidsNum) && poidsNum >= 0.01 && poidsNum <= 150;

  const needsConcentration =
    selectedPosologie !== null &&
    selectedPosologie.volume_min === null &&
    selectedPosologie.dose_min !== null &&
    (med?.concentrations.length ?? 0) > 0;

  const result = useMemo(() => {
    if (!selectedPosologie || !poidsValid) return null;
    return calculateResult(
      selectedPosologie,
      poidsNum,
      needsConcentration ? selectedConcentration : null
    );
  }, [selectedPosologie, poidsNum, selectedConcentration, needsConcentration]);

  if (isLoading || !med) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1B7A5A" />
      </View>
    );
  }

  const noPosologie = hasSpecies && selectedEspece && filteredPosologies.length === 0;
  const isUnknownDose =
    selectedPosologie &&
    selectedPosologie.volume_min === null &&
    selectedPosologie.dose_min === null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{med.nom}</Text>
        <View style={styles.metaRow}>
          {med.frequence && (
            <Text style={styles.metaTag}>{med.frequence}</Text>
          )}
          {med.voies_administration.map((v) => (
            <Text key={v} style={styles.metaTag}>{v}</Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calcul de posologie</Text>

        {hasSpecies && (
          <SpeciesSelector
            especes={especes}
            selected={selectedEspece}
            onSelect={setSelectedEspece}
          />
        )}

        {noPosologie && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Aucune posologie définie pour cette espèce.
            </Text>
          </View>
        )}

        {filteredPosologies.length > 1 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Type de formulation</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {filteredPosologies.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPosologieId(p.id)}
                  style={[
                    styles.badge,
                    selectedPosologieId === p.id && styles.badgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      selectedPosologieId === p.id && styles.badgeTextActive,
                    ]}
                  >
                    {getPosologieLabel(p)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            <Text style={styles.errorText}>Poids entre 0.01 et 150 kg</Text>
          )}
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={styles.label}>Voie d'administration</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {med.voies_administration.map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => setSelectedVoie(v)}
                style={[
                  styles.badge,
                  selectedVoie === v && styles.badgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    selectedVoie === v && styles.badgeTextActive,
                  ]}
                >
                  {VOIE_LABELS[v] ?? v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {needsConcentration && (
          <ConcentrationBadge
            values={med.concentrations}
            selected={selectedConcentration}
            onSelect={setSelectedConcentration}
            label="Concentration"
            unit="mg/ml"
          />
        )}

        {isUnknownDose && selectedPosologie?.note && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>Protocole</Text>
            <Text style={styles.resultValue}>{selectedPosologie.note}</Text>
          </View>
        )}

        {isUnknownDose && !selectedPosologie?.note && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Le dosage de ce médicament ne peut pas être calculé automatiquement.
              Référez-vous au protocole de la clinique.
            </Text>
          </View>
        )}

        {result && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>{result.label}</Text>
            {result.min === result.max ? (
              <Text style={styles.resultValue}>
                {result.min} {result.unite}
              </Text>
            ) : (
              <Text style={styles.resultValue}>
                {result.min} – {result.max} {result.unite}
              </Text>
            )}
            {selectedPosologie?.dose_min !== null && (
              <Text style={styles.resultSub}>
                Dose : {selectedPosologie!.dose_min}
                {selectedPosologie!.dose_min !== selectedPosologie!.dose_max
                  ? ` – ${selectedPosologie!.dose_max}`
                  : ""}{" "}
                {selectedPosologie!.unite} × {poidsNum} kg
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
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
    marginBottom: 8,
  },
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
  warning: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  warningText: { color: "#F57F17", fontWeight: "600", fontSize: 13 },
  badge: {
    paddingHorizontal: 12,
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
  badgeText: { fontSize: 13, color: "#555" },
  badgeTextActive: { color: "#fff" },
  result: {
    marginTop: 16,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B7A5A",
  },
  resultSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
});
