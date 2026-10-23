import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDependencies } from "@/main/di";
import { queryRoots } from "@/shared/query/queryRoots";
import type { ConsolidationStatus } from "../../domain/models";
import type { CreateConsolidationInput, CreateTemplateInput, SaveResponsesInput } from "../../domain/usecases";
import { createConsolidation, createTemplate, saveResponses } from "../../domain/usecases";

function useInvalidate() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [queryRoots.consolidations] }),
      queryClient.invalidateQueries({ queryKey: [queryRoots.dashboard] }),
    ]);
}

export function useCreateConsolidation() {
  const dependencies = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (input: CreateConsolidationInput) => createConsolidation(dependencies, input),
    onSuccess,
  });
}

export function useSaveResponses() {
  const dependencies = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (input: SaveResponsesInput) => saveResponses(dependencies, input),
    onSuccess,
  });
}

export function useUpdateConsolidationStatus(consolidationId: string) {
  const { consolidationRepository } = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (status: ConsolidationStatus) => consolidationRepository.updateStatus(consolidationId, status),
    onSuccess,
  });
}

export function useDeleteConsolidation() {
  const { consolidationRepository } = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (consolidationId: string) => consolidationRepository.delete(consolidationId),
    onSuccess,
  });
}

export function useCreateTemplate() {
  const dependencies = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (input: CreateTemplateInput) => createTemplate(dependencies, input),
    onSuccess,
  });
}

export function useDuplicateTemplate() {
  const { consolidationRepository } = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (templateId: string) => consolidationRepository.duplicateTemplate(templateId),
    onSuccess,
  });
}

export function useDeleteTemplate() {
  const { consolidationRepository } = useDependencies();
  const onSuccess = useInvalidate();
  return useMutation({
    mutationFn: (templateId: string) => consolidationRepository.deleteTemplate(templateId),
    onSuccess,
  });
}
