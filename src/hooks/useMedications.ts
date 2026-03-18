import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedications,
  getMedicationById,
  searchMedications,
  createMedication,
  updateMedication,
  deleteMedication,
} from "../data/repository";
import { Medication } from "../types";

const MEDICATIONS_KEY = ["medications"] as const;

export function useMedications() {
  return useQuery({
    queryKey: MEDICATIONS_KEY,
    queryFn: getMedications,
  });
}

export function useMedicationSearch(query: string) {
  return useQuery({
    queryKey: [...MEDICATIONS_KEY, "search", query],
    queryFn: () => searchMedications(query),
  });
}

export function useMedication(id: string) {
  return useQuery({
    queryKey: [...MEDICATIONS_KEY, id],
    queryFn: () => getMedicationById(id),
    enabled: !!id,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Medication, "id" | "created_at" | "updated_at">) =>
      createMedication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICATIONS_KEY });
    },
    onError: (error) => {
      console.error("[useCreateMedication] onError:", error);
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Medication, "id" | "created_at" | "updated_at">>;
    }) => updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICATIONS_KEY });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICATIONS_KEY });
    },
  });
}
