import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { todayIso } from "@/shared/format";
import { requireParams, routes } from "@/shared/navigation";
import { Banner, Button, Card, ChipGroup, commonStyles, EmptyState, Field, Loading } from "@/shared/ui";
import { templatesForDiscipline } from "../../../domain/rules";
import { TemplatePreview } from "../../components/TemplatePreview";
import { useConsolidationTemplates } from "../../hooks/useConsolidationTemplates";
import { useCreateConsolidation } from "../../hooks/useConsolidationMutations";
import { styles } from "./styles";

export function NewConsolidationScreen() {
  const params = requireParams(useLocalSearchParams(), ["classId", "discipline", "className"] as const);
  const templates = useConsolidationTemplates();
  const [templateId, setTemplateId] = useState("");
  const [date, setDate] = useState(todayIso);
  const [title, setTitle] = useState("");
  const { mutate, isPending, error } = useCreateConsolidation();

  const available = useMemo(
    () => templatesForDiscipline(templates.data ?? [], params?.discipline ?? ""),
    [templates.data, params?.discipline]
  );
  const options = useMemo(() => available.map((template) => ({ value: template.id, label: template.name })), [available]);
  const selected = available.find((template) => template.id === templateId);

  if (!params) return <EmptyState message="Turma não encontrada." />;
  if (templates.isPending) return <Loading />;

  const save = () =>
    mutate(
      { classId: params.classId, disciplineName: params.discipline, templateId: selected?.id ?? null, date, title },
      { onSuccess: ({ id }) => router.replace(routes.consolidation({ consolidationId: id })) }
    );

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: `Nova consolidação · ${params.className}` }} />
      <Text style={commonStyles.subtitle}>{params.discipline}</Text>
      {templates.error ? (
        <Banner message={errorMessage(templates.error)} onAction={() => void templates.refetch()} />
      ) : null}
      <Card style={styles.card}>
        {options.length ? (
          <ChipGroup label="Modelo" options={options} value={templateId} onChange={setTemplateId} />
        ) : (
          <View style={styles.group}>
            <Text style={commonStyles.text}>Nenhum modelo disponível para esta disciplina.</Text>
            <Button
              variant="outline"
              title="Criar meu modelo"
              onPress={() => router.push(routes.newConsolidationTemplate())}
            />
          </View>
        )}
        {selected ? <TemplatePreview template={selected} /> : null}
        <Field label="Título (opcional)" value={title} onChangeText={setTitle} placeholder="Ex.: Diagnóstica 1" />
        <View style={styles.group}>
          <Field
            label="Data (AAAA-MM-DD)"
            value={date}
            onChangeText={setDate}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
          <Text style={commonStyles.muted}>
            O bimestre é definido pela data. Entram os alunos matriculados nesse dia.
          </Text>
        </View>
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível criar a consolidação")} /> : null}
      <Button title="Criar e abrir tabela" onPress={save} loading={isPending} />
    </ScrollView>
  );
}
