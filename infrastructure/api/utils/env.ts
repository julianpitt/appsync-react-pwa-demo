export function requiredEnvs<T extends string>(...args: T[]) {
  const envs = {} as Record<T, string>;
  for (const requiredEnv of args) {
    if (!(requiredEnv in process.env)) {
      throw new Error(`required env var ${String(requiredEnv)} was not defined`);
    }
    envs[requiredEnv] = process.env[requiredEnv as keyof typeof process.env] as string;
  }
  return envs;
}
