import { fireEvent, screen } from "@testing-library/react-native";
import { UnauthorizedError } from "@/core/domain/errors";
import { createTestDependencies, renderWithProviders } from "@/test/renderWithProviders";
import { LoginScreen } from "./LoginScreen";

describe("LoginScreen", () => {
  it("mostra e oculta a senha pelo olhinho", async () => {
    await renderWithProviders(<LoginScreen />);

    expect(screen.getByLabelText("Senha").props.secureTextEntry).toBe(true);
    await fireEvent.press(screen.getByLabelText("Mostrar senha"));
    expect(screen.getByLabelText("Senha").props.secureTextEntry).toBe(false);
    await fireEvent.press(screen.getByLabelText("Ocultar senha"));
    expect(screen.getByLabelText("Senha").props.secureTextEntry).toBe(true);
  });

  it("valida campos vazios sem chamar a API", async () => {
    const { dependencies } = await renderWithProviders(<LoginScreen />);

    await fireEvent.press(screen.getByText("Entrar"));

    expect(await screen.findByText("Informe email e senha")).toBeTruthy();
    expect(dependencies.authRepository.login).not.toHaveBeenCalled();
  });

  it("exibe o erro da API e grava a sessão quando entra", async () => {
    const dependencies = createTestDependencies();
    const login = dependencies.authRepository.login as jest.Mock;
    login.mockRejectedValueOnce(new UnauthorizedError("Email ou senha inválidos"));
    await renderWithProviders(<LoginScreen />, dependencies);

    await fireEvent.changeText(screen.getByLabelText("Email"), "delvangela@gmail.com");
    await fireEvent.changeText(screen.getByLabelText("Senha"), "errada");
    await fireEvent.press(screen.getByText("Entrar"));
    expect(await screen.findByText("Email ou senha inválidos")).toBeTruthy();

    const session = {
      accessToken: "a",
      refreshToken: "r",
      user: { id: "u1", name: "Delvangela", email: "delvangela@gmail.com", role: "TEACHER" as const, teacherId: "t1" },
    };
    login.mockResolvedValueOnce(session);
    await fireEvent.changeText(screen.getByLabelText("Senha"), "123");
    await fireEvent.press(screen.getByText("Entrar"));

    await screen.findByText("Entrar");
    expect(login).toHaveBeenLastCalledWith({ email: "delvangela@gmail.com", password: "123" });
    expect(dependencies.session.session).toEqual(session);
  });
});
