import { useMemo, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ChipGroup } from "@/shared/ui";
import type { DashboardClassOption, DashboardFilters } from "../../../domain/models";
import { disciplinesFor } from "../../../domain/rules";
import { styles } from "./styles";

type ResolvedFilters = DashboardFilters & { schoolYear: number; term: number };

interface FiltersModalProps {
  visible: boolean;
  initial: ResolvedFilters;
  classes: DashboardClassOption[];
  onApply: (filters: DashboardFilters) => void;
  onClose: () => void;
}

const ALL = "";
const YEARS_BACK = 3;
const TERMS = [1, 2, 3, 4];

export function FiltersModal({ visible, initial, classes, onApply, onClose }: FiltersModalProps) {
  const [draft, setDraft] = useState(initial);
  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: YEARS_BACK }, (_, index) => current - index).map((year) => ({
      value: year,
      label: String(year),
    }));
  }, []);
  const disciplines = useMemo(() => disciplinesFor(classes, draft.classId), [classes, draft.classId]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      onShow={() => setDraft(initial)}
    >
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title} accessibilityRole="header">
            Filtros
          </Text>

          <Text style={styles.label}>Ano letivo</Text>
          <ChipGroup
            value={draft.schoolYear}
            onChange={(schoolYear) => setDraft({ schoolYear, term: draft.term })}
            options={years}
          />

          <Text style={styles.label}>Bimestre</Text>
          <ChipGroup
            value={draft.term}
            onChange={(term) => setDraft({ ...draft, term })}
            options={TERMS.map((term) => ({ value: term, label: `${term}º` }))}
          />

          <Text style={styles.label}>Turma</Text>
          <ChipGroup
            value={draft.classId ?? ALL}
            onChange={(classId) => setDraft({ ...draft, classId: classId || undefined, disciplineName: undefined })}
            options={[{ value: ALL, label: "Todas" }, ...classes.map((item) => ({ value: item.id, label: item.name }))]}
          />

          <Text style={styles.label}>Disciplina</Text>
          <ChipGroup
            value={draft.disciplineName ?? ALL}
            onChange={(disciplineName) => setDraft({ ...draft, disciplineName: disciplineName || undefined })}
            options={[{ value: ALL, label: "Todas" }, ...disciplines.map((item) => ({ value: item, label: item }))]}
          />
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Cancelar" variant="outline" onPress={onClose} style={styles.button} />
          <Button
            title="Aplicar"
            onPress={() => {
              onApply(draft);
              onClose();
            }}
            style={styles.button}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
