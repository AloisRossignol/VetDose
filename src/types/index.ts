export type Espece = "chien" | "chat" | "lapin" | "furet" | "rongeur";

export type VoieAdmin = "PO" | "PO CHIR" | "SC" | "IM" | "IV" | "IR";

export interface Medication {
  id: string;
  nom: string;
  concentrations: number[]; // mg/ml
  frequence: string | null;
  voies_administration: VoieAdmin[];
  created_at: string;
  updated_at: string;
}

export interface Posologie {
  id: string;
  medicament_id: string;
  espece: Espece | null;       // null = valable pour toutes les espèces
  voie_admin: VoieAdmin | null; // null = valable pour toutes les voies
  volume_min: number | null;   // ml/kg
  volume_max: number | null;   // ml/kg
  dose_min: number | null;     // mg/kg ou UI/kg
  dose_max: number | null;
  unite: string;
  note: string | null;
  created_at: string;
}


export type RootStackParamList = {
  MedicationList: undefined;
  MedicationDetail: { medicationId: string };
  Calculator: undefined;
};