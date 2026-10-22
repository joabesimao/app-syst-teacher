import { ActivityIndicator, View } from "react-native";
import { colors } from "../../theme";
import { styles } from "./styles";

export function Loading({ inline = false }: { inline?: boolean }) {
  return (
    <View style={inline ? styles.inline : styles.fill} accessibilityLabel="Carregando">
      <ActivityIndicator size={inline ? "small" : "large"} color={colors.primary} />
    </View>
  );
}
