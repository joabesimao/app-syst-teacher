const DEFAULT_API_URL = "http://localhost:3000/api";

const readApiUrl = () => {
  const value = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!value) return DEFAULT_API_URL;
  if (!/^https?:\/\//.test(value)) {
    throw new Error(`EXPO_PUBLIC_API_URL inválida: "${value}". Use http(s)://host:porta/api`);
  }
  return value;
};

export const env = {
  apiUrl: readApiUrl(),
};
