type RawParams = Record<string, string | string[] | undefined>;

export const readParam = (params: RawParams, key: string) => {
  const value = params[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single && single.trim() ? single : undefined;
};

export const requireParams = <K extends string>(params: RawParams, keys: readonly K[]) => {
  const result = {} as Record<K, string>;
  for (const key of keys) {
    const value = readParam(params, key);
    if (!value) return null;
    result[key] = value;
  }
  return result;
};
