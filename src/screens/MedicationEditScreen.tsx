import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useMedication,
  useCreateMedication,
  useUpdateMedication,
} from "../hooks/useMedications";
import { FormeGalenique, VoieAdmin } from "../types";
import type { RootStackScreenProps } from "../navigation/types";

const FORMES: { value: FormeGalenique; label: string }[] = [
  { value: "comprime", label: "Comprimé" },
  { value: "injectable", label: "Injectable" },
  { value: "solution_orale", label: "Solution orale" },
];

const VOIES: VoieAdmin[] = ["PO", "SC", "IM", "IV"];

export default function MedicationEditScreen({
  route,
  navigation,
}: RootStackScreenProps<"MedicationEdit">) {
  const insets = useSafeAreaInsets();
  const medicationId = route.params?.medicationId;
  const isEdit = !!medicationId;

  const { data: existing } = useMedication(medicationId ?? "");
  const createMutation = useCreateMedication();
  const updateMutation = useUpdateMedication();

  const [nomCommercial, setNomCommercial] = useState("");
  const [dci, setDci] = useState("");
  const [famille, setFamille] = useState("");
  const [formeGalenique, setFormeGalenique] = useState<FormeGalenique>("injectable");
  const [voies, setVoies] = useState<VoieAdmin[]>([]);
  const [concentrations, setConcentrations] = useState("");
  const [dosagesComprimes, setDosagesComprimes] = useState("");
  const [frequence, setFrequence] = useState("");
  const [contreIndications, setContreIndications] = useState("");
  const [ordonnance, setOrdonnance] = useState(false);

  useEffect(() => {
    if (existing) {
      setNomCommercial(existing.nom_commercial);
      setDci(existing.dci);
      setFamille(existing.famille);
      setFormeGalenique(existing.forme_galenique);
      setVoies(existing.voies_administration);
      setConcentrations(existing.concentrations.join(", "));
      setDosagesComprimes(existing.dosages_comprimes?.join(", ") ?? "");
      setFrequence(existing.frequence);
      setContreIndications(existing.contre_indications);
      setOrdonnance(existing.ordonnance);
    }
  }, [existing]);

  const toggleVoie = (v: VoieAdmin) => {
    setVoies((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const parseNumbers = (str: string): number[] =>
    str
      .split(",")
      .map((s) => parseFloat(s.trim().replace(",", ".")))
      .filter((n) => !isNaN(n) && n > 0);

  const handleSave = async () => {
    if (!nomCommercial.trim() || !dci.trim()) {
      Alert.alert("Erreur", "Le nom commercial et la DCI sont obligatoires.");
      return;
    }
    if (voies.length === 0) {
      Alert.alert("Erreur", "Sélectionnez au moins une voie d'administration.");
      return;
    }

    const data = {
      nom_commercial: nomCommercial.trim(),
      dci: dci.trim(),
      famille: famille.trim(),
      forme_galenique: formeGalenique,
      voies_administration: voies,
      concentrations: parseNumbers(concentrations),
      dosages_comprimes:
        formeGalenique === "comprime" ? parseNumbers(dosagesComprimes) : undefined,
      frequence: frequence.trim(),
      contre_indications: contreIndications.trim(),
      ordonnance,
    };

    try {
      if (isEdit && medicationId) {
        await updateMutation.mutateAsync({ id: medicationId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigation.goBack();
    } catch (error) {
      console.error("[MedicationEdit] save failed:", error);
      Alert.alert("Erreur", `Échec de la sauvegarde : ${error}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom commercial *</Text>
            <TextInput
              style={styles.input}
              value={nomCommercial}
              onChangeText={setNomCommercial}
              placeholder="Ex : Meloxidyl"
              placeholderTextColor="#bbb"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DCI (principe actif) *</Text>
            <TextInput
              style={styles.input}
              value={dci}
              onChangeText={setDci}
              placeholder="Ex : Méloxicam"
              placeholderTextColor="#bbb"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Famille thérapeutique</Text>
            <TextInput
              style={styles.input}
              value={famille}
              onChangeText={setFamille}
              placeholder="Ex : AINS, Antibiotique..."
              placeholderTextColor="#bbb"
            />
          </View>

          {/* Forme galénique */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Forme galénique</Text>
            <View style={styles.badgeRow}>
              {FORMES.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[
                    styles.badge,
                    formeGalenique === f.value && styles.badgeActive,
                  ]}
                  onPress={() => setFormeGalenique(f.value)}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      formeGalenique === f.value && styles.badgeTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Voies */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Voies d'administration *</Text>
            <View style={styles.badgeRow}>
              {VOIES.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.badge,
                    voies.includes(v) && styles.badgeActive,
                  ]}
                  onPress={() => toggleVoie(v)}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      voies.includes(v) && styles.badgeTextActive,
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Concentrations */}
          {formeGalenique !== "comprime" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Concentrations (mg/ml, séparées par des virgules)</Text>
              <TextInput
                style={styles.input}
                value={concentrations}
                onChangeText={setConcentrations}
                placeholder="Ex : 1.5, 5, 10"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
              />
            </View>
          )}

          {/* Dosages comprimés */}
          {formeGalenique === "comprime" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosages comprimés (mg, séparés par des virgules)</Text>
              <TextInput
                style={styles.input}
                value={dosagesComprimes}
                onChangeText={setDosagesComprimes}
                placeholder="Ex : 50, 250, 500"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fréquence d'administration</Text>
            <TextInput
              style={styles.input}
              value={frequence}
              onChangeText={setFrequence}
              placeholder="Ex : 1×/jour pendant 5 jours"
              placeholderTextColor="#bbb"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contre-indications</Text>
            <TextInput
              style={[styles.input, { minHeight: 60, textAlignVertical: "top" }]}
              value={contreIndications}
              onChangeText={setContreIndications}
              placeholder="Texte libre..."
              placeholderTextColor="#bbb"
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => setOrdonnance(!ordonnance)}
          >
            <View
              style={[styles.checkbox, ordonnance && styles.checkboxActive]}
            >
              {ordonnance && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.toggleLabel}>Ordonnance obligatoire</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>
            {isEdit ? "Enregistrer les modifications" : "Créer le médicament"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  badgeRow: {
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
  badgeText: { fontSize: 13, fontWeight: "500", color: "#555" },
  badgeTextActive: { color: "#fff" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#1B7A5A",
    borderColor: "#1B7A5A",
  },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  toggleLabel: { fontSize: 14, color: "#333" },
  saveBtn: {
    backgroundColor: "#1B7A5A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
