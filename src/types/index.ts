export type Espece = "chien" | "chat" | "lapin" | "furet" | "rongeur";

export type VoieAdmin = "PO" | "SC" | "IM" | "IV";

export type FormeGalenique = "comprime" | "injectable" | "solution_orale";

export interface Medication {
  id: string;
  nom_commercial: string;
  dci: string;
  famille: string;
  forme_galenique: FormeGalenique;
  voies_administration: VoieAdmin[];
  concentrations: number[]; // mg/ml
  dosages_comprimes?: number[]; // mg par comprimé (si forme comprimé)
  frequence: string;
  contre_indications: string;
  ordonnance: boolean;
  created_at: string;
  updated_at: string;
}

export interface Posologie {
  id: string;
  medicament_id: string;
  espece: Espece;
  tranche_age: string;
  dose_min: number; // mg/kg (ou µg/kg, UI/kg)
  dose_max: number; // = dose_min si dose fixe
  unite: string; // "mg/kg" | "µg/kg" | "UI/kg"
}

export interface CalculationInput {
  espece: Espece;
  poids: number; // kg
  voie: VoieAdmin;
  concentration: number; // mg/ml
  dose_min: number;
  dose_max: number;
  forme_galenique: FormeGalenique;
  dosage_comprime?: number; // mg par comprimé
}

export interface CalculationResult {
  dose_totale_min: number; // mg
  dose_totale_max: number; // mg
  volume_min?: number; // ml (injectable / solution orale)
  volume_max?: number; // ml
  nb_comprimes_min?: number; // (comprimés)
  nb_comprimes_max?: number;
  is_range: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  medication_name: string;
  espece: Espece;
  poids: number;
  voie: VoieAdmin;
  concentration: number;
  result: CalculationResult;
}

export type RootStackParamList = {
  Tabs: undefined;
  MedicationDetail: { medicationId: string };
  MedicationEdit: { medicationId?: string }; // undefined = ajout
};

export type TabParamList = {
  Medications: undefined;
  Calculator: undefined;
  History: undefined;
};
