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
import { COLORS, FONTS, formatFrequence } from "../theme";
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
  if (p.tableau_posologie) return p.unite || "Tableau";
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
  const { medicationId, defaultVoie } = route.params;
  const { data: med, isLoading } = useMedication(medicationId);
  const { data: posologies = [] } = usePosologiesForMedication(medicationId);
  const { data: especes = [] } = useEspecesForMedication(medicationId);

  const hasSpecies = especes.length > 0;

  const [selectedEspece, setSelectedEspece] = useState<Espece | null>(null);
  const [poids, setPoids] = useState("");
  const [selectedVoie, setSelectedVoie] = useState<VoieAdmin | null>(defaultVoie ?? null);
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
      if (!filteredPosologies.some((p) => p.id === selectedPosologieId)) {
        setSelectedPosologieId(filteredPosologies[0].id);
      }
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
          {formatFrequence(med.frequence) && (
            <Text style={styles.metaTag}>{formatFrequence(med.frequence)}</Text>
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
            <Text style={styles.label}>Dosage</Text>
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

        {isUnknownDose && selectedPosologie?.tableau_posologie && (
          <View style={styles.tableau}>
            <View style={styles.tableauHeader}>
              {selectedPosologie.tableau_posologie.colonnes.map((col, i) => (
                <View key={i} style={[{ flex: 1 }, i === 0 && { flex: 0.8 }]}>
                  <Text style={styles.tableauHeaderCell}>{col}</Text>
                  {i === selectedPosologie.tableau_posologie!.colonnes.length - 1 && selectedPosologie.tableau_posologie!.legende && (
                    <Text style={styles.tableauLegende}>{selectedPosologie.tableau_posologie!.legende}</Text>
                  )}
                </View>
              ))}
            </View>
            {selectedPosologie.tableau_posologie.lignes.map((ligne, i) => {
              const lignes = selectedPosologie.tableau_posologie!.lignes;
              const highlighted = poidsValid && poidsNum >= ligne.w && (
                ligne.w_max !== undefined
                  ? poidsNum <= ligne.w_max
                  : i === lignes.length - 1 || poidsNum < lignes[i + 1].w
              );
              return (
                <View
                  key={i}
                  style={[styles.tableauRow, i % 2 === 1 && styles.tableauRowAlt, highlighted && styles.tableauRowHighlight]}
                >
                  {ligne.v.map((cell, j) => (
                    <Text key={j} style={[styles.tableauCell, j === 0 && { flex: 0.8 }, highlighted && styles.tableauCellHighlight]}>
                      {cell}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {isUnknownDose && !selectedPosologie?.tableau_posologie && selectedPosologie?.note && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>Protocole</Text>
            <Text style={styles.resultValue}>{selectedPosologie.note}</Text>
          </View>
        )}

        {isUnknownDose && !selectedPosologie?.tableau_posologie && !selectedPosologie?.note && (
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

        {selectedPosologie?.note && !isUnknownDose && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{selectedPosologie.note}</Text>
          </View>
        )}

        {result && selectedPosologie?.duree_perfusion_min && result.unite === "ml" && (
          <View style={[styles.noteBox, { marginTop: 8 }]}>
            <Text style={styles.noteText}>
              {"Débit (perfusion " + selectedPosologie.duree_perfusion_min + " min) : "}
              <Text style={{ fontFamily: FONTS.semiBold }}>
                {result.min === result.max
                  ? (Math.round((result.min! / selectedPosologie.duree_perfusion_min) * 60 * 10) / 10) + " mL/h"
                  : (Math.round((result.min! / selectedPosologie.duree_perfusion_min) * 60 * 10) / 10) +
                    " – " +
                    (Math.round((result.max! / selectedPosologie.duree_perfusion_min) * 60 * 10) / 10) +
                    " mL/h"}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 8,
  },
  metaRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", alignItems: "flex-start" },
  metaTag: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 12 },
  label: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 4, fontFamily: FONTS.regular },
  tableau: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tableauHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tableauHeaderCell: {
    color: "#fff",
    fontFamily: FONTS.bold,
    fontSize: 13,
  },
  tableauLegende: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  tableauRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: COLORS.card,
  },
  tableauRowAlt: { backgroundColor: COLORS.background },
  tableauRowHighlight: { backgroundColor: COLORS.primaryLight },
  tableauCell: { flex: 1, fontSize: 13, fontFamily: FONTS.regular, color: COLORS.text },
  tableauCellHighlight: { fontFamily: FONTS.bold, color: COLORS.primary },
  warning: {
    backgroundColor: COLORS.warning,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  warningText: { color: COLORS.warningText, fontFamily: FONTS.semiBold, fontSize: 13 },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  badgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  badgeText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textSecondary },
  badgeTextActive: { color: "#fff", fontFamily: FONTS.semiBold },
  result: {
    marginTop: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    color: COLORS.primary,
  },
  resultSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  noteBox: {
    marginTop: 12,
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warningText,
  },
  noteText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: "#5D4037",
    lineHeight: 19,
  },
});
