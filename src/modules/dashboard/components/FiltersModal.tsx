import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChipGroup } from "../../../components/ChipGroup";
import { Button } from "../../../components/ui";
import { colors, spacing } from "../../../theme";
import type { DashboardClassOption, DashboardFilters } from "../types";

interface FiltersModalProps {
  visible: boolean;
  initial: DashboardFilters & { schoolYear: number; term: number };
  classes: DashboardClassOption[];
  onApply: (filters: DashboardFilters) => void;
  onClose: () => void;
}

const ALL = "";

export function FiltersModal({ visible, initial, classes, onApply, onClose }: FiltersModalProps) {
  const [draft, setDraft] = useState(initial);
  const currentYear = new Date().getFullYear();
  const selectedClass = classes.find((item) => item.id === draft.classId);
  const disciplines = [
    ...new Set((selectedClass ? [selectedClass] : classes).flatMap((item) => item.disciplines)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose} onShow={() => setDraft(initial)}>
      <SafeAreaView style={modalStyles.screen} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={modalStyles.content}>
          <Text style={modalStyles.title}>Filtros</Text>

          <Text style={modalStyles.label}>Ano letivo</Text>
          <ChipGroup
            value={draft.schoolYear}
            onChange={(schoolYear) => setDraft({ schoolYear, term: draft.term })}
            options={[currentYear, currentYear - 1, currentYear - 2].map((year) => ({
              value: year,
              label: String(year),
            }))}
          />

          <Text style={modalStyles.label}>Bimestre</Text>
          <ChipGroup
            value={draft.term}
            onChange={(term) => setDraft({ ...draft, term })}
            options={[1, 2, 3, 4].map((term) => ({ value: term, label: `${term}º` }))}
          />

          <Text style={modalStyles.label}>Turma</Text>
          <ChipGroup
            value={draft.classId ?? ALL}
            onChange={(classId) =>
              setDraft({ ...draft, classId: classId || undefined, disciplineName: undefined })
            }
            options={[{ value: ALL, label: "Todas" }, ...classes.map((item) => ({ value: item.id, label: item.name }))]}
          />

          <Text style={modalStyles.label}>Disciplina</Text>
          <ChipGroup
            value={draft.disciplineName ?? ALL}
            onChange={(disciplineName) => setDraft({ ...draft, disciplineName: disciplineName || undefined })}
            options={[{ value: ALL, label: "Todas" }, ...disciplines.map((item) => ({ value: item, label: item }))]}
          />
        </ScrollView>
        <View style={modalStyles.footer}>
          <Button title="Cancelar" variant="outline" onPress={onClose} style={modalStyles.button} />
          <Button
            title="Aplicar"
            onPress={() => {
              onApply(draft);
              onClose();
            }}
            style={modalStyles.button}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing(2), gap: spacing(1) },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: spacing(1) },
  label: { fontSize: 13, fontWeight: "600", color: colors.muted, marginTop: spacing(1.5) },
  footer: { flexDirection: "row", gap: spacing(1.5), padding: spacing(2) },
  button: { flex: 1 },
});
