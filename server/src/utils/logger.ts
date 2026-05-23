export const logger = {
  info: (...args: unknown[]) => console.log('[nexflow]', ...args),
  error: (...args: unknown[]) => console.error('[nexflow:error]', ...args),
};
