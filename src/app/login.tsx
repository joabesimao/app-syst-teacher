import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Banner, Button, Card, Field, styles } from "../components/ui";
import { useAuthStore } from "../store/useAuthStore";
import { spacing } from "../theme";

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      setError("Informe email e senha");
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar");
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.center, { alignItems: "stretch" }]}
      >
        <Card style={{ gap: spacing(2), padding: spacing(3) }}>
          <View>
            <Text style={styles.title}>Professor PWR</Text>
            <Text style={styles.subtitle}>Entre com seu email e senha</Text>
          </View>
          {error ? <Banner message={error} /> : null}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="username"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            onSubmitEditing={submit}
            returnKeyType="go"
          />
          <Button title="Entrar" onPress={submit} loading={submitting} />
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
