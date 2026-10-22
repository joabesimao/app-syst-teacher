import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { errorMessage } from "@/core/domain/errors";
import { Banner, Button, Card, commonStyles, Field, PasswordField } from "@/shared/ui";
import { useLogin } from "../../hooks/useLogin";
import { styles } from "./styles";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useLogin();

  const submit = () => mutate({ email, password });

  return (
    <SafeAreaView style={commonStyles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <Card style={styles.card}>
          <View>
            <Text style={commonStyles.title} accessibilityRole="header">
              Professor PWR
            </Text>
            <Text style={commonStyles.subtitle}>Entre com seu email e senha</Text>
          </View>
          {error ? <Banner message={errorMessage(error, "Não foi possível entrar")} /> : null}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="username"
          />
          <PasswordField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            textContentType="password"
            onSubmitEditing={submit}
            returnKeyType="go"
          />
          <Button title="Entrar" onPress={submit} loading={isPending} />
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
