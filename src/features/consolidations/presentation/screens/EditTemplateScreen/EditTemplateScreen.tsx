import { router, Stack, useLocalSearchParams } from "expo-router";
import { readParam } from "@/shared/navigation";
import { EmptyState, Loading } from "@/shared/ui";
import { draftFromTemplate } from "../../../domain/scale";
import { TemplateForm } from "../../components/TemplateForm";
import { useConsolidationTemplates } from "../../hooks/useConsolidationTemplates";
import { useUpdateTemplate } from "../../hooks/useConsolidationMutations";

export function EditTemplateScreen() {
  const templateId = readParam(useLocalSearchParams(), "templateId");
  const templates = useConsolidationTemplates();
  const { mutate, isPending, error } = useUpdateTemplate();

  if (templates.isPending) return <Loading />;

  const template = templates.data?.find((item) => item.id === templateId);
  if (!template) return <EmptyState message="Modelo não encontrado." />;

  return (
    <>
      <Stack.Screen options={{ title: "Editar modelo" }} />
      <TemplateForm
        initial={draftFromTemplate(template)}
        sources={(templates.data ?? []).filter((item) => item.id !== template.id)}
        locked={template.locked ? template : undefined}
        submitTitle="Salvar alterações"
        loading={isPending}
        error={error}
        errorFallback="Não foi possível salvar o modelo"
        onSubmit={(draft) => mutate({ template, draft }, { onSuccess: () => router.back() })}
      />
    </>
  );
}
