import { Posologie } from "../types";

export const stubPosologies: Posologie[] = [
  // Amoxiclav — Chien
  {
    id: "pos-001",
    medicament_id: "med-001",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 12.5,
    dose_max: 25,
    unite: "mg/kg",
  },
  // Amoxiclav — Chat
  {
    id: "pos-002",
    medicament_id: "med-001",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 12.5,
    dose_max: 25,
    unite: "mg/kg",
  },

  // Meloxidyl injectable — Chien
  {
    id: "pos-003",
    medicament_id: "med-002",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },
  // Meloxidyl injectable — Chat
  {
    id: "pos-004",
    medicament_id: "med-002",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },
  // Meloxidyl injectable — Lapin
  {
    id: "pos-005",
    medicament_id: "med-002",
    espece: "lapin",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },

  // Convenia — Chien
  {
    id: "pos-006",
    medicament_id: "med-003",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 8,
    dose_max: 8,
    unite: "mg/kg",
  },
  // Convenia — Chat
  {
    id: "pos-007",
    medicament_id: "med-003",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 8,
    dose_max: 8,
    unite: "mg/kg",
  },

  // Baytril — Chien
  {
    id: "pos-008",
    medicament_id: "med-004",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Chat
  {
    id: "pos-009",
    medicament_id: "med-004",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 5,
    unite: "mg/kg",
  },
  // Baytril — Lapin
  {
    id: "pos-010",
    medicament_id: "med-004",
    espece: "lapin",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Furet
  {
    id: "pos-011",
    medicament_id: "med-004",
    espece: "furet",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Rongeur
  {
    id: "pos-012",
    medicament_id: "med-004",
    espece: "rongeur",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },

  // Dexdomitor — Chien
  {
    id: "pos-013",
    medicament_id: "med-005",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.01,
    dose_max: 0.04,
    unite: "mg/kg",
  },
  // Dexdomitor — Chat
  {
    id: "pos-014",
    medicament_id: "med-005",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 0.01,
    dose_max: 0.04,
    unite: "mg/kg",
  },

  // Itrafungol — Chat uniquement
  {
    id: "pos-015",
    medicament_id: "med-006",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 5,
    unite: "mg/kg",
  },

  // Pfizerpène — Chien
  {
    id: "pos-016",
    medicament_id: "med-007",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 20000,
    dose_max: 20000,
    unite: "UI/kg",
  },
  // Pfizerpène — Chat
  {
    id: "pos-017",
    medicament_id: "med-007",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 20000,
    dose_max: 20000,
    unite: "UI/kg",
  },

  // Metacam oral — Chien (J1 dose d'attaque)
  {
    id: "pos-018",
    medicament_id: "med-008",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.1,
    dose_max: 0.2,
    unite: "mg/kg",
  },
];
