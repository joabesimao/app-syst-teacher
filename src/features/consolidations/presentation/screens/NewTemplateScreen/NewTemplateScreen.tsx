import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { errorMessage } from "@/core/domain/errors";
import { Banner, Button, Card, ChipGroup, commonStyles, Field, Loading } from "@/shared/ui";
import { parseItems } from "../../../domain/usecases";
import { OptionTag } from "../../components/OptionTag";
import { useConsolidationTemplates } from "../../hooks/useConsolidationTemplates";
import { useCreateTemplate } from "../../hooks/useConsolidationMutations";
import { styles } from "./styles";

export function NewTemplateScreen() {
  const templates = useConsolidationTemplates();
  const [name, setName] = useState("");
  const [items, setItems] = useState("");
  const [baseId, setBaseId] = useState("");
  const { mutate, isPending, error } = useCreateTemplate();

  const bases = useMemo(
    () => (templates.data ?? []).map((template) => ({ value: template.id, label: template.name })),
    [templates.data]
  );
  const base = templates.data?.find((template) => template.id === baseId) ?? null;
  const itemCount = parseItems(items).length;

  if (templates.isPending) return <Loading />;

  const save = () => mutate({ name, items, base }, { onSuccess: () => router.back() });

  return (
    <ScrollView
      style={commonStyles.screen}
      contentContainerStyle={commonStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: "Novo modelo" }} />
      <Text style={commonStyles.subtitle}>
        O modelo fica só para você. A escala (opções, cores e valores) é copiada de um modelo existente.
      </Text>
      <Card style={styles.card}>
        <Field label="Nome" value={name} onChangeText={setName} placeholder="Ex.: Problemas com frações" />
        <View style={styles.group}>
          <Field
            label="Itens (um por linha)"
            value={items}
            onChangeText={setItems}
            multiline
            style={styles.items}
            placeholder={"Adição\nSubtração"}
          />
          <Text style={commonStyles.muted}>{itemCount} itens</Text>
        </View>
        <ChipGroup label="Copiar escala de" options={bases} value={baseId} onChange={setBaseId} />
        {base ? (
          <View style={styles.scale}>
            {base.options.map((option) => (
              <OptionTag key={option.id} option={option} display="text" />
            ))}
          </View>
        ) : null}
      </Card>
      {error ? <Banner message={errorMessage(error, "Não foi possível criar o modelo")} /> : null}
      <Button title="Criar modelo" onPress={save} loading={isPending} />
    </ScrollView>
  );
}
