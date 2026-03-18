import { CalculationInput, CalculationResult } from "../types";

/**
 * Arrondit au quart de comprimé le plus proche.
 */
function roundToQuarter(n: number): number {
  return Math.round(n * 4) / 4;
}

/**
 * Calcule le résultat de posologie selon les paramètres d'entrée.
 */
export function calculateDosage(input: CalculationInput): CalculationResult {
  const { poids, concentration, dose_min, dose_max, forme_galenique, dosage_comprime } = input;

  const dose_totale_min = dose_min * poids;
  const dose_totale_max = dose_max * poids;
  const is_range = dose_min !== dose_max;

  const result: CalculationResult = {
    dose_totale_min,
    dose_totale_max,
    is_range,
  };

  if (forme_galenique === "comprime" && dosage_comprime && dosage_comprime > 0) {
    result.nb_comprimes_min = roundToQuarter(dose_totale_min / dosage_comprime);
    result.nb_comprimes_max = roundToQuarter(dose_totale_max / dosage_comprime);
  } else if (concentration > 0) {
    // injectable ou solution orale
    result.volume_min = dose_totale_min / concentration;
    result.volume_max = dose_totale_max / concentration;
  }

  return result;
}

/**
 * Calculatrice rapide : dose libre + poids + concentration → volume.
 */
export function quickCalculate(
  doseMgKg: number,
  poidsKg: number,
  concentrationMgMl: number
): { dose_totale: number; volume: number } {
  const dose_totale = doseMgKg * poidsKg;
  const volume = concentrationMgMl > 0 ? dose_totale / concentrationMgMl : 0;
  return { dose_totale, volume };
}

/**
 * Formate un nombre pour l'affichage (max 3 décimales, pas de zéros inutiles).
 */
export function formatNumber(n: number): string {
  if (n >= 100) return n.toFixed(1);
  if (n >= 10) return n.toFixed(2);
  return n.toFixed(3).replace(/\.?0+$/, "") || "0";
}
