# Professor PWR — App Mobile

App para o professor fazer chamada e lançar notas pelo celular. Ele usa a mesma API do sistema web
(`api-syst-teacher`), então tudo o que é registrado no app aparece no web e vice-versa.

Feito com **React Native + Expo SDK 57** e **Expo Router**, em TypeScript.

<p align="center">
  <img src="docs/screenshots/turmas.png" width="200" alt="Minhas turmas" />
  <img src="docs/screenshots/chamadas.png" width="200" alt="Chamadas da turma" />
  <img src="docs/screenshots/nova-chamada.png" width="200" alt="Nova chamada" />
  <img src="docs/screenshots/avaliacoes.png" width="200" alt="Avaliações" />
</p>

## Funcionalidades

- **Login** com email e senha. A sessão fica no armazenamento seguro do aparelho (SecureStore) e é renovada
  automaticamente: o professor não precisa entrar de novo a cada abertura do app.
- **Minhas turmas:** as turmas e disciplinas atribuídas ao professor logado.
- **Chamada:**
  - Uma chamada nova começa com todos presentes; basta tocar em **Falta** ou **Justificada**.
  - Dá para escolher a data e a quantidade de aulas e anotar o conteúdo.
  - Chamadas já registradas podem ser abertas e corrigidas.
- **Lançar notas:**
  - Aceita vírgula (`8,5`) e não deixa salvar nota acima da nota máxima.
  - Só permite editar avaliações **Em andamento**; as demais abrem só para leitura.
- **Alunos:** lista de alunos da turma.

Os cadastros (turmas, alunos, professores, avaliações e calendário) continuam no sistema web.

## Pré-requisitos

- **Node.js** 20 ou mais recente.
- A **API** rodando, com um professor que tenha senha. O seed da API cria `admin@admin.com`, senha
  `admin123`. Para definir a senha de um professor existente, rode na API:
  `npm run teacher:set-password -- <email> <senha>`.
- O app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) ·
  [iOS](https://apps.apple.com/app/expo-go/id982107779)), ou um emulador Android ou simulador iOS.

## Como rodar

```bash
npm install
cp .env.example .env.local
```

Edite `.env.local` e aponte `EXPO_PUBLIC_API_URL` para a API:

| Onde o app roda | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Celular físico (Expo Go) | `http://<IP-do-computador>:3000/api`, ex.: `http://192.168.1.35:3000/api` |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Simulador iOS ou navegador | `http://localhost:3000/api` |

> `localhost` não funciona no celular: ele aponta para o próprio aparelho. Para descobrir o IP do computador,
> use `ip addr` (Linux), `ipconfig` (Windows) ou `ipconfig getifaddr en0` (macOS).

Depois, inicie o app:

```bash
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iOS). O celular e o computador precisam estar na mesma rede Wi-Fi.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npx expo start` | Inicia o servidor de desenvolvimento |
| `npx expo start --web` | Abre o app no navegador |
| `npm run typecheck` | Checa os tipos com TypeScript |
| `npm run lint` | Roda o ESLint com a configuração do Expo |

## Estrutura

```
src/
  app/                  telas — com o Expo Router, cada arquivo é uma rota
    _layout.tsx         navegação e rotas que exigem login
    login.tsx           login
    index.tsx           minhas turmas
    turma.tsx           abas Chamadas | Avaliações | Alunos
    chamada.tsx         nova chamada e edição de chamada
    notas.tsx           lançamento de notas
  components/ui.tsx     botões, campos, cards e avisos
  hooks/useAsync.ts     carrega dados e recarrega ao voltar para a tela
  services/             cliente HTTP, sessão e chamadas da API
  store/                estado de login (zustand)
  types/  utils/        tipos do domínio e formatação
```

### Código compartilhado com o web

Estes arquivos são **cópias idênticas** dos que estão em `front-syst-teacher/src/`. Ao alterar um, altere o outro:

| Arquivo | Conteúdo |
| --- | --- |
| `types/domain.ts` | Tipos do domínio (turma, aluno, avaliação, chamada…) |
| `services/apiClient.ts` | Envio do token, renovação automática da sessão, login e logout |
| `services/schoolApi.ts` | Funções de cada endpoint da API |
| `utils/labels.ts` | Rótulos e formatação de datas e números |
| `store/useAuthStore.ts` | Estado de login |

O que muda entre as plataformas é configurado em `src/app/_layout.tsx` via `configureApi`: a URL da API e onde a
sessão é guardada. No celular, `services/sessionStore.ts` usa o SecureStore. No navegador, `services/sessionStore.web.ts`
usa o `localStorage`.

O plano é extrair esses arquivos para um pacote compartilhado entre os dois projetos.

## Como funciona o login

1. `POST /api/auth/login` devolve um **access token** (JWT, 15 min) e um **refresh token** (30 dias).
2. Toda requisição envia `Authorization: Bearer <access token>`.
3. Quando a API responde 401, o app troca o refresh token por um novo par (`POST /api/auth/refresh`) e repete a
   requisição. Se várias requisições falharem ao mesmo tempo, a troca é feita uma vez só.
4. Se o refresh também falhar, a sessão é apagada e o app volta para o login.
5. **Sair** chama `POST /api/auth/logout`, que invalida o refresh token no servidor.

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| "Network request failed" no celular | `EXPO_PUBLIC_API_URL` usa `localhost`, o IP está errado, a API está parada ou o firewall bloqueia a porta 3000 |
| Mudei o `.env.local` e nada mudou | Reinicie o `npx expo start` e recarregue o app |
| Login recusado com a senha certa | O professor está sem senha ou inativo; defina com `npm run teacher:set-password` na API |
| Erro de CORS no navegador | Inclua a origem do Expo Web (ex.: `http://localhost:8081`) em `CORS_ORIGINS` na API. O app nativo não usa CORS |
| "Notas só podem ser lançadas…" | A avaliação não está *Em andamento*; mude o status pelo sistema web |

## Publicação

- A API precisa estar em **HTTPS**: Android e iOS bloqueiam HTTP sem criptografia em builds de produção.
- Os builds e o envio para as lojas são feitos com o EAS: `npx eas-cli@latest build`.
  Veja a [documentação do EAS](https://docs.expo.dev/eas/).
# mobile-systeacher
