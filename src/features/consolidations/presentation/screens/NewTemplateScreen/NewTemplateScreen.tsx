import { router, Stack } from "expo-router";
import { Loading } from "@/shared/ui";
import type { TemplateDraft } from "../../../domain/models";
import { SCALE_PRESETS } from "../../../domain/scale";
import { TemplateForm } from "../../components/TemplateForm";
import { useConsolidationTemplates } from "../../hooks/useConsolidationTemplates";
import { useCreateTemplate } from "../../hooks/useConsolidationMutations";

const [defaultPreset] = SCALE_PRESETS;
const initial: TemplateDraft = { name: "", description: "", items: "", scale: defaultPreset.scale };

export function NewTemplateScreen() {
  const templates = useConsolidationTemplates();
  const { mutate, isPending, error } = useCreateTemplate();

  if (templates.isPending) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: "Novo modelo" }} />
      <TemplateForm
        initial={initial}
        initialPreset={defaultPreset.id}
        sources={templates.data ?? []}
        submitTitle="Criar modelo"
        loading={isPending}
        error={error}
        errorFallback="Não foi possível criar o modelo"
        onSubmit={(draft) => mutate(draft, { onSuccess: () => router.back() })}
      />
    </>
  );
}
