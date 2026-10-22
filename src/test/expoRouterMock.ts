export const mockRouter = { push: jest.fn(), back: jest.fn(), replace: jest.fn() };

export const mockParams: { current: Record<string, string> } = { current: {} };

export const expoRouterMock = () => ({
  router: mockRouter,
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams.current,
  Stack: { Screen: () => null },
});
