# VetDose — Cahier des charges technique

> Application mobile de calcul de posologie vétérinaire
> Version 1.0 — 18 mars 2026

---

## 1. Stack technique

| Composant | Technologie | Notes |
|---|---|---|
| Framework mobile | **React Native (Expo SDK 52+)** | Expo Go / EAS Build |
| Navigation | **React Navigation v6** (@react-navigation/native) | Tabs + Stack |
| State / Data | **TanStack Query (React Query v5)** | Cache, mutations, offline-ready |
| Base de données locale | **Expo SQLite** | Persistance hors-ligne |
| Stockage préférences | **AsyncStorage** | Préférences utilisateur simples |
| Langue | **TypeScript** | Strict mode |
| UI | **React Native** composants natifs | Pas de lib UI tierce en v1 |
| Export / partage | `expo-sharing` + `expo-file-system` | Partage natif iOS/Android |
| Déploiement | **Expo EAS Build** | Distribution sans stores |

### Données en v1 (développement)

- **Pas de backend** : données stubées en local (fichier JSON / mémoire)
- Les hooks TanStack Query pointent vers un data layer abstrait (`src/data/`) qui retourne les stubs
- Ce layer sera remplacé par Supabase plus tard sans toucher aux composants

---

## 2. Architecture projet

```
vetdose/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx     # Stack principal
│   │   ├── TabNavigator.tsx      # Bottom tabs (3 onglets)
│   │   └── types.ts             # Types navigation
│   ├── screens/
│   │   ├── MedicationListScreen.tsx   # Onglet Médicaments (liste)
│   │   ├── MedicationDetailScreen.tsx # Fiche médicament + calcul
│   │   ├── MedicationEditScreen.tsx   # Ajout / modification (admin)
│   │   ├── CalculatorScreen.tsx       # Onglet Calculatrice rapide
│   │   └── HistoryScreen.tsx          # Onglet Historique
│   ├──
│   ├── data/
│   │   ├── stub-medications.ts   # Données stubées médicaments
│   │   ├── stub-posologies.ts    # Données stubées posologies
│   │   └── repository.ts        # Data layer abstrait
│   ├── hooks/
│   │   ├── useMedications.ts     # TanStack Query hooks médicaments
│   │   ├── usePosologies.ts      # TanStack Query hooks posologies
│   │   └── useCalculation.ts     # Hook de calcul posologie
│   ├── types/
│   │   └── index.ts              # Types TypeScript
│   ├── utils/
│   │   └── calculations.ts      # Fonctions pures de calcul
│   └── components/
│       ├── MedicationCard.tsx     # Carte médicament (liste)
│       ├── DoseResult.tsx        # Affichage résultat calcul
│       ├── SpeciesSelector.tsx   # Sélecteur espèce
│       └── ConcentrationBadge.tsx# Badge concentration cliquable
├── assets/
├── app.json
├── tsconfig.json
└── package.json
```

---

## 3. Modèles de données

### Medication

```typescript
interface Medication {
  id: string;                          // UUID
  nom_commercial: string;              // ex: "Meloxidyl"
  dci: string;                         // ex: "Méloxicam"
  famille: string;                     // ex: "AINS"
  forme_galenique: FormeGalenique;     // "comprime" | "injectable" | "solution_orale"
  voies_administration: VoieAdmin[];   // ["PO", "SC", "IV", "IM"]
  concentrations: number[];            // en mg/ml — ex: [1.5, 5]
  frequence: string;                   // ex: "1×/jour pendant 5 jours"
  contre_indications: string;          // texte libre
  ordonnance: boolean;
  created_at: string;
  updated_at: string;
}
```

### Posologie

```typescript
interface Posologie {
  id: string;
  medicament_id: string;
  espece: Espece;                      // "chien" | "chat" | "lapin" | "furet" | "rongeur"
  tranche_age: string;                 // "adulte" (seul en v1 stub)
  dose_min: number;                    // mg/kg
  dose_max: number;                    // mg/kg (= dose_min si dose fixe)
  unite: string;                       // "mg/kg" | "µg/kg" | "UI/kg"
}
```

### Types utilitaires

```typescript
type Espece = "chien" | "chat" | "lapin" | "furet" | "rongeur";
type VoieAdmin = "PO" | "SC" | "IM" | "IV";
type FormeGalenique = "comprime" | "injectable" | "solution_orale";
```

---

## 4. Formules de calcul

### Volume injectable / solution orale

```
Volume (ml) = [Dose (mg/kg) × Poids (kg)] / Concentration (mg/ml)
```

### Nombre de comprimés

```
Nb comprimés = [Dose (mg/kg) × Poids (kg)] / Dosage du comprimé (mg)
→ Arrondi au quart le plus proche (0.25, 0.5, 0.75, 1, 1.25...)
```

### Plage de doses

Si `dose_min ≠ dose_max`, afficher les deux bornes (volume min / volume max).

---

## 5. Règles métier

- Espèce sans posologie définie → message d'avertissement
- Contre-indication pour l'espèce → bandeau alerte orange
- Recalcul temps réel à chaque modification de paramètre
- Poids minimum : **0.01 kg** (petits rongeurs)
- Poids maximum : **150 kg**

---

## 6. Écrans & navigation

| Onglet | Écran | Description |
|---|---|---|
| **Médicaments** | Liste | Recherche par nom/DCI/famille, regroupement par famille, cartes avec tags espèces |
| | Fiche + calcul | En-tête médicament, formulaire calcul (espèce/poids/voie/concentration), résultat temps réel |
| | Ajout/modif | Formulaire complet — admin uniquement |
| **Calculatrice** | Calcul rapide | Dose libre (mg/kg) + poids + concentration → volume |
| **Historique** | Session | Derniers calculs effectués (en mémoire, non persisté) |

### UX

- Résultat accessible en **≤ 3 interactions** depuis l'accueil
- Utilisable **d'une seule main**
- Typographie lisible en faible luminosité
- **Français uniquement**

---

## 7. Données stub (développement)

8 médicaments pré-chargés :

| Nom | DCI | Espèces | Famille | Forme |
|---|---|---|---|---|
| Amoxiclav | Amoxicilline / ac. clavulanique | Chien, Chat | Antibiotique | Comprimé |
| Meloxidyl | Méloxicam | Chien, Chat, Lapin | AINS | Injectable |
| Convenia | Céfovécine | Chien, Chat | Antibiotique | Injectable |
| Baytril | Enrofloxacine | Chien, Chat, NAC | Antibiotique | Injectable |
| Dexdomitor | Médétomidine | Chien, Chat | Sédatif | Injectable |
| Itrafungol | Itraconazole | Chat | Antifongique | Solution orale |
| Pfizerpène | Benzylpénicilline | Chien, Chat | Antibiotique | Injectable |
| Metacam oral | Méloxicam | Chien | AINS | Solution orale |

---

## 8. Hors périmètre v1

- Gestion dossiers patients / animaux
- Historique traçable par animal
- Interactions médicamenteuses
- Photo/scan boîtes
- Multi-langues
- Facteurs correcteurs (IRC, race...)
- Import CSV
- Backend Supabase (données stub uniquement)

---

## 9. Phases

| Phase | Contenu | Statut |
|---|---|---|
| Phase 0 — Cadrage | CDC, questionnaire ASV | **En cours** |
| Phase 1 — Prototype | Maquette interactive | **Validé** |
| Phase 2 — v1 dev | Dev React Native / Expo + stubs | **À faire** |
| Phase 3 — Tests | Tests ASV, corrections | À faire |
| Phase 4 — Déploiement | EAS Build, distribution | À faire |
