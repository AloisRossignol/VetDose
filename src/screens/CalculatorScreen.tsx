import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { quickCalculate, formatNumber } from "../utils/calculations";
import { COLORS, FONTS } from "../theme";

type Tab = "simple" | "volume" | "perfusion";

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("simple");

  // Tab 1 — Dose simple
  const [simpleUnite, setSimpleUnite] = useState<"mg/kg" | "ml/kg">("mg/kg");
  const [simpleDose, setSimpleDose] = useState("");
  const [simplePoids, setSimplePoids] = useState("");

  // Tab 2 — Dose + Volume
  const [dose, setDose] = useState("");
  const [poids, setPoids] = useState("");
  const [concentration, setConcentration] = useState("");

  // Tab 3 — Perfusion
  const [perfPoids, setPerfPoids] = useState("");
  const [showDeshydratation, setShowDeshydratation] = useState(false);
  const [deshydPct, setDeshydPct] = useState("");

  const simpleResult = useMemo(() => {
    const d = parseFloat(simpleDose.replace(",", "."));
    const p = parseFloat(simplePoids.replace(",", "."));
    if (isNaN(d) || d <= 0 || isNaN(p) || p < 0.01 || p > 150) return null;
    return {
      value: Math.round(d * p * 100) / 100,
      unite: simpleUnite === "mg/kg" ? "mg" : "ml",
    };
  }, [simpleDose, simplePoids, simpleUnite]);

  const volumeResult = useMemo(() => {
    const d = parseFloat(dose.replace(",", "."));
    const p = parseFloat(poids.replace(",", "."));
    const c = parseFloat(concentration.replace(",", "."));
    if (isNaN(d) || d <= 0 || isNaN(p) || p < 0.01 || p > 150 || isNaN(c) || c <= 0) return null;
    return quickCalculate(d, p, c);
  }, [dose, poids, concentration]);

  const perfResult = useMemo(() => {
    const p = parseFloat(perfPoids.replace(",", "."));
    if (isNaN(p) || p < 0.01 || p > 150) return null;
    const maintenance = ((p * 30) + 70) / 24;
    let dehydration = 0;
    if (showDeshydratation) {
      const pct = parseFloat(deshydPct.replace(",", "."));
      if (!isNaN(pct) && pct > 0) {
        dehydration = (pct / 100 * p * 1000) / 24;
      }
    }
    return { maintenance, dehydration, total: maintenance + dehydration };
  }, [perfPoids, showDeshydratation, deshydPct]);

  const TABS: { key: Tab; label: string }[] = [
    { key: "simple", label: "Dose" },
    { key: "volume", label: "Volume" },
    { key: "perfusion", label: "Perfusion" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "simple" && (
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              {(["mg/kg", "ml/kg"] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.badge, simpleUnite === u && styles.badgeActive]}
                  onPress={() => setSimpleUnite(u)}
                >
                  <Text style={[styles.badgeText, simpleUnite === u && styles.badgeTextActive]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dose ({simpleUnite})</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 5"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={simpleDose}
                onChangeText={setSimpleDose}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 25"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={simplePoids}
                onChangeText={setSimplePoids}
              />
            </View>

            {simpleResult && (
              <View style={styles.result}>
                <Text style={styles.resultLabel}>Quantité à administrer</Text>
                <Text style={styles.resultValue}>
                  {simpleResult.value} {simpleResult.unite}
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "volume" && (
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dose (mg/kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 0.2"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={dose}
                onChangeText={setDose}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 25"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={poids}
                onChangeText={setPoids}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Concentration (mg/ml)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 5"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={concentration}
                onChangeText={setConcentration}
              />
            </View>

            {volumeResult && (
              <View style={styles.result}>
                <Text style={styles.resultLabel}>Volume à administrer</Text>
                <Text style={styles.resultValue}>
                  {formatNumber(volumeResult.volume)} ml
                </Text>
                <Text style={styles.resultSub}>
                  Dose totale : {formatNumber(volumeResult.dose_totale)} mg
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "perfusion" && (
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : 25"
                placeholderTextColor="#bbb"
                keyboardType="decimal-pad"
                value={perfPoids}
                onChangeText={setPerfPoids}
              />
            </View>

            <TouchableOpacity
              style={[styles.deshydBtn, showDeshydratation && styles.deshydBtnActive]}
              onPress={() => {
                setShowDeshydratation(!showDeshydratation);
                if (showDeshydratation) setDeshydPct("");
              }}
            >
              <Text style={[styles.deshydBtnText, showDeshydratation && styles.deshydBtnTextActive]}>
                {showDeshydratation ? "✓ Déshydratation activée" : "+ Ajouter déshydratation"}
              </Text>
            </TouchableOpacity>

            {showDeshydratation && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>% de déshydratation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex : 20"
                  placeholderTextColor="#bbb"
                  keyboardType="decimal-pad"
                  value={deshydPct}
                  onChangeText={setDeshydPct}
                />
              </View>
            )}

            {perfResult && (
              <View style={styles.result}>
                <Text style={styles.resultLabel}>Débit de perfusion</Text>
                <Text style={styles.resultValue}>
                  {formatNumber(perfResult.total)} ml/h
                </Text>
                {perfResult.dehydration > 0 && (
                  <Text style={styles.resultSub}>
                    Entretien : {formatNumber(perfResult.maintenance)} ml/h
                    {" + "}Déshydratation : {formatNumber(perfResult.dehydration)} ml/h
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 16,
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
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: 6,
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
  deshydBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    marginBottom: 14,
  },
  deshydBtnActive: {
    backgroundColor: COLORS.primaryLight,
  },
  deshydBtnText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  deshydBtnTextActive: {
    color: COLORS.primary,
  },
  result: {
    marginTop: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultValue: { fontSize: 36, fontFamily: FONTS.extraBold, color: COLORS.primary },
  resultSub: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginTop: 8, textAlign: "center" },
});
