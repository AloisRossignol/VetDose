export type Espece = "chien" | "chat" | "lapin" | "furet" | "rongeur";

export type VoieAdmin = "PO" | "PO CHIR" | "SC" | "IM" | "IV" | "IR";

export interface Medication {
  id: string;
  nom: string;
  concentrations: number[]; // mg/ml
  frequence: string | null;
  voies_administration: VoieAdmin[];
  alias_de: string | null;  // UUID du médicament principal si c'est un alias
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
  duree_perfusion_min: number | null;
  tableau_posologie: { colonnes: string[]; legende?: string; lignes: { w: number; w_max?: number; v: string[] }[] } | null;
  created_at: string;
}


export type RootStackParamList = {
  MedicationList: undefined;
  MedicationDetail: { medicationId: string; defaultVoie?: VoieAdmin };
  Calculator: undefined;
};