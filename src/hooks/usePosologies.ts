import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosologiesForMedication,
  getPosologie,
  getEspecesForMedication,
  createPosologie,
} from "../data/repository";
import { Espece, Posologie } from "../types";

const POSOLOGIES_KEY = ["posologies"] as const;

export function usePosologiesForMedication(medicamentId: string) {
  return useQuery({
    queryKey: [...POSOLOGIES_KEY, medicamentId],
    queryFn: () => getPosologiesForMedication(medicamentId),
    enabled: !!medicamentId,
  });
}

export function usePosologie(medicamentId: string, espece: Espece | null) {
  return useQuery({
    queryKey: [...POSOLOGIES_KEY, medicamentId, espece],
    queryFn: () => getPosologie(medicamentId, espece!),
    enabled: !!medicamentId && !!espece,
  });
}

export function useEspecesForMedication(medicamentId: string) {
  return useQuery({
    queryKey: [...POSOLOGIES_KEY, medicamentId, "especes"],
    queryFn: () => getEspecesForMedication(medicamentId),
    enabled: !!medicamentId,
  });
}

export function useCreatePosologie() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Posologie, "id">) => createPosologie(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POSOLOGIES_KEY });
    },
  });
}
