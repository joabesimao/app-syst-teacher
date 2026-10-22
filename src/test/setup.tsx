jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

jest.mock("@expo/vector-icons/Ionicons", () => {
  const { Text } = jest.requireActual("react-native");
  return { __esModule: true, default: ({ name }: { name: string }) => <Text>{name}</Text> };
});

jest.mock("expo-router/drawer", () => ({
  Drawer: () => null,
  DrawerContentScrollView: () => null,
  DrawerItem: () => null,
  DrawerItemList: () => null,
}));
