import { Text, View } from "react-native";
import { Button } from "../Button";
import { styles } from "./styles";

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Stepper({ label, value, min, max, onChange }: StepperProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Button
          variant="outline"
          title="−"
          accessibilityLabel={`Diminuir ${label.toLowerCase()}`}
          disabled={value <= min}
          onPress={() => onChange(Math.max(min, value - 1))}
          style={styles.button}
        />
        <Text style={styles.value} accessibilityLabel={`${label}: ${value}`}>
          {value}
        </Text>
        <Button
          variant="outline"
          title="+"
          accessibilityLabel={`Aumentar ${label.toLowerCase()}`}
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, value + 1))}
          style={styles.button}
        />
      </View>
    </View>
  );
}
