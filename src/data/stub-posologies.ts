import { Posologie } from "../types";

export const stubPosologies: Posologie[] = [
  // Amoxiclav — Chien
  {
    id: "b2c3d4e5-0001-4000-8000-000000000001",
    medicament_id: "a1b2c3d4-0001-4000-8000-000000000001",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 12.5,
    dose_max: 25,
    unite: "mg/kg",
  },
  // Amoxiclav — Chat
  {
    id: "b2c3d4e5-0002-4000-8000-000000000002",
    medicament_id: "a1b2c3d4-0001-4000-8000-000000000001",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 12.5,
    dose_max: 25,
    unite: "mg/kg",
  },

  // Meloxidyl injectable — Chien
  {
    id: "b2c3d4e5-0003-4000-8000-000000000003",
    medicament_id: "a1b2c3d4-0002-4000-8000-000000000002",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },
  // Meloxidyl injectable — Chat
  {
    id: "b2c3d4e5-0004-4000-8000-000000000004",
    medicament_id: "a1b2c3d4-0002-4000-8000-000000000002",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },
  // Meloxidyl injectable — Lapin
  {
    id: "b2c3d4e5-0005-4000-8000-000000000005",
    medicament_id: "a1b2c3d4-0002-4000-8000-000000000002",
    espece: "lapin",
    tranche_age: "adulte",
    dose_min: 0.2,
    dose_max: 0.2,
    unite: "mg/kg",
  },

  // Convenia — Chien
  {
    id: "b2c3d4e5-0006-4000-8000-000000000006",
    medicament_id: "a1b2c3d4-0003-4000-8000-000000000003",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 8,
    dose_max: 8,
    unite: "mg/kg",
  },
  // Convenia — Chat
  {
    id: "b2c3d4e5-0007-4000-8000-000000000007",
    medicament_id: "a1b2c3d4-0003-4000-8000-000000000003",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 8,
    dose_max: 8,
    unite: "mg/kg",
  },

  // Baytril — Chien
  {
    id: "b2c3d4e5-0008-4000-8000-000000000008",
    medicament_id: "a1b2c3d4-0004-4000-8000-000000000004",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Chat
  {
    id: "b2c3d4e5-0009-4000-8000-000000000009",
    medicament_id: "a1b2c3d4-0004-4000-8000-000000000004",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 5,
    unite: "mg/kg",
  },
  // Baytril — Lapin
  {
    id: "b2c3d4e5-0010-4000-8000-000000000010",
    medicament_id: "a1b2c3d4-0004-4000-8000-000000000004",
    espece: "lapin",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Furet
  {
    id: "b2c3d4e5-0011-4000-8000-000000000011",
    medicament_id: "a1b2c3d4-0004-4000-8000-000000000004",
    espece: "furet",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },
  // Baytril — Rongeur
  {
    id: "b2c3d4e5-0012-4000-8000-000000000012",
    medicament_id: "a1b2c3d4-0004-4000-8000-000000000004",
    espece: "rongeur",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 10,
    unite: "mg/kg",
  },

  // Dexdomitor — Chien
  {
    id: "b2c3d4e5-0013-4000-8000-000000000013",
    medicament_id: "a1b2c3d4-0005-4000-8000-000000000005",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.01,
    dose_max: 0.04,
    unite: "mg/kg",
  },
  // Dexdomitor — Chat
  {
    id: "b2c3d4e5-0014-4000-8000-000000000014",
    medicament_id: "a1b2c3d4-0005-4000-8000-000000000005",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 0.01,
    dose_max: 0.04,
    unite: "mg/kg",
  },

  // Itrafungol — Chat uniquement
  {
    id: "b2c3d4e5-0015-4000-8000-000000000015",
    medicament_id: "a1b2c3d4-0006-4000-8000-000000000006",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 5,
    dose_max: 5,
    unite: "mg/kg",
  },

  // Pfizerpène — Chien
  {
    id: "b2c3d4e5-0016-4000-8000-000000000016",
    medicament_id: "a1b2c3d4-0007-4000-8000-000000000007",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 20000,
    dose_max: 20000,
    unite: "UI/kg",
  },
  // Pfizerpène — Chat
  {
    id: "b2c3d4e5-0017-4000-8000-000000000017",
    medicament_id: "a1b2c3d4-0007-4000-8000-000000000007",
    espece: "chat",
    tranche_age: "adulte",
    dose_min: 20000,
    dose_max: 20000,
    unite: "UI/kg",
  },

  // Metacam oral — Chien (J1 dose d'attaque)
  {
    id: "b2c3d4e5-0018-4000-8000-000000000018",
    medicament_id: "a1b2c3d4-0008-4000-8000-000000000008",
    espece: "chien",
    tranche_age: "adulte",
    dose_min: 0.1,
    dose_max: 0.2,
    unite: "mg/kg",
  },
];