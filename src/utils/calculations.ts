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
