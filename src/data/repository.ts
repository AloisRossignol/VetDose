import { Medication, Posologie, Espece } from "../types";
import { stubMedications } from "./stub-medications";
import { stubPosologies } from "./stub-posologies";
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// In-memory store (will be replaced by SQLite / Supabase later)
let medications = [...stubMedications];
let posologies = [...stubPosologies];

// --- Medications ---

export async function getMedications(): Promise<Medication[]> {
  return [...medications];
}

export async function getMedicationById(
  id: string
): Promise<Medication | undefined> {
  return medications.find((m) => m.id === id);
}

export async function searchMedications(query: string): Promise<Medication[]> {
  const q = query.toLowerCase().trim();
  if (!q) return [...medications];
  return medications.filter(
    (m) =>
      m.nom_commercial.toLowerCase().includes(q) ||
      m.dci.toLowerCase().includes(q) ||
      m.famille.toLowerCase().includes(q)
  );
}

export async function createMedication(
  data: Omit<Medication, "id" | "created_at" | "updated_at">
): Promise<Medication> {
  const now = new Date().toISOString();
  const id = generateId();
  const med: Medication = {
    ...data,
    id,
    created_at: now,
    updated_at: now,
  };
  medications.push(med);
  return med;
}

export async function updateMedication(
  id: string,
  data: Partial<Omit<Medication, "id" | "created_at" | "updated_at">>
): Promise<Medication | undefined> {
  const idx = medications.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  medications[idx] = {
    ...medications[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return medications[idx];
}

export async function deleteMedication(id: string): Promise<boolean> {
  const len = medications.length;
  medications = medications.filter((m) => m.id !== id);
  posologies = posologies.filter((p) => p.medicament_id !== id);
  return medications.length < len;
}

// --- Posologies ---

export async function getPosologiesForMedication(
  medicamentId: string
): Promise<Posologie[]> {
  return posologies.filter((p) => p.medicament_id === medicamentId);
}

export async function getPosologie(
  medicamentId: string,
  espece: Espece
): Promise<Posologie | undefined> {
  return posologies.find(
    (p) => p.medicament_id === medicamentId && p.espece === espece
  );
}

export async function getEspecesForMedication(
  medicamentId: string
): Promise<Espece[]> {
  const posos = posologies.filter((p) => p.medicament_id === medicamentId);
  return [...new Set(posos.map((p) => p.espece))];
}

export async function createPosologie(
  data: Omit<Posologie, "id">
): Promise<Posologie> {
  const poso: Posologie = { ...data, id: generateId() };
  posologies.push(poso);
  return poso;
}

export async function updatePosologie(
  id: string,
  data: Partial<Omit<Posologie, "id">>
): Promise<Posologie | undefined> {
  const idx = posologies.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  posologies[idx] = { ...posologies[idx], ...data };
  return posologies[idx];
}

export async function deletePosologie(id: string): Promise<boolean> {
  const len = posologies.length;
  posologies = posologies.filter((p) => p.id !== id);
  return posologies.length < len;
}
