import { Medication, Posologie, Espece } from "../types";
import { supabase } from "../lib/supabase";

// --- Medications ---

export async function getMedications(): Promise<Medication[]> {
  const { data, error } = await supabase
    .from("medicaments")
    .select("*")
    .order("nom");
  if (error) throw error;
  return data;
}

export async function getMedicationById(
  id: string
): Promise<Medication | undefined> {
  const { data, error } = await supabase
    .from("medicaments")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return data;
}

export async function searchMedications(query: string): Promise<Medication[]> {
  const q = query.trim();
  if (!q) return getMedications();
  const { data, error } = await supabase
    .from("medicaments")
    .select("*")
    .ilike("nom", `%${q}%`)
    .order("nom");
  if (error) throw error;
  return data;
}

export async function createMedication(
  data: Omit<Medication, "id" | "created_at" | "updated_at">
): Promise<Medication> {
  const { data: created, error } = await supabase
    .from("medicaments")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updateMedication(
  id: string,
  data: Partial<Omit<Medication, "id" | "created_at" | "updated_at">>
): Promise<Medication | undefined> {
  const { data: updated, error } = await supabase
    .from("medicaments")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) return undefined;
  return updated;
}

export async function deleteMedication(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("medicaments")
    .delete()
    .eq("id", id);
  return !error;
}

// --- Posologies ---

export async function getPosologiesForMedication(
  medicamentId: string
): Promise<Posologie[]> {
  const { data, error } = await supabase
    .from("posologies")
    .select("*")
    .eq("medicament_id", medicamentId);
  if (error) throw error;
  return data;
}

export async function getPosologie(
  medicamentId: string,
  espece: Espece
): Promise<Posologie | undefined> {
  // Cherche d'abord une posologie spécifique à l'espèce
  const { data: specific } = await supabase
    .from("posologies")
    .select("*")
    .eq("medicament_id", medicamentId)
    .eq("espece", espece)
    .limit(1);
  if (specific && specific.length > 0) return specific[0];

  // Sinon retourne la posologie générique (espece = null)
  const { data: generic } = await supabase
    .from("posologies")
    .select("*")
    .eq("medicament_id", medicamentId)
    .is("espece", null)
    .limit(1);
  if (generic && generic.length > 0) return generic[0];

  return undefined;
}

export async function getEspecesForMedication(
  medicamentId: string
): Promise<Espece[]> {
  const { data, error } = await supabase
    .from("posologies")
    .select("espece")
    .eq("medicament_id", medicamentId)
    .not("espece", "is", null);
  if (error) throw error;
  return [...new Set(data.map((p) => p.espece as Espece))];
}

export async function createPosologie(
  data: Omit<Posologie, "id" | "created_at">
): Promise<Posologie> {
  const { data: created, error } = await supabase
    .from("posologies")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updatePosologie(
  id: string,
  data: Partial<Omit<Posologie, "id" | "created_at">>
): Promise<Posologie | undefined> {
  const { data: updated, error } = await supabase
    .from("posologies")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) return undefined;
  return updated;
}

export async function deletePosologie(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("posologies")
    .delete()
    .eq("id", id);
  return !error;
}
