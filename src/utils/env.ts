export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const env = <T = any>(key: string, defaultValue?: T): T => {
  const value = process.env[key];
  try {
    if (typeof value !== 'undefined') {
      return JSON.parse(value) as T;
    }
  } catch (error) {
    return value as any as T;
  }
  return defaultValue;
};

export default env;
