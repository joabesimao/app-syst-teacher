import { Text, View } from "react-native";
import { tones } from "../../theme";
import { Button } from "../Button";
import { styles } from "./styles";

type BannerTone = "danger" | "info" | "success";

interface BannerProps {
  message: string;
  tone?: BannerTone;
  actionLabel?: string;
  onAction?: () => void;
}

export function Banner({ message, tone = "danger", actionLabel, onAction }: BannerProps) {
  return (
    <View
      accessibilityRole={tone === "danger" ? "alert" : undefined}
      style={[styles.banner, { backgroundColor: tones[tone].background }]}
    >
      <Text style={styles.text}>{message}</Text>
      {onAction ? (
        <Button variant="outline" title={actionLabel ?? "Tentar de novo"} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}
