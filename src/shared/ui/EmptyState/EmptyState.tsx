import { Text, View } from "react-native";
import { styles } from "./styles";

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
