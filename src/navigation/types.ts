import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  MedicationList: undefined;
  MedicationDetail: { medicationId: string };
  Calculator: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
