import { LogLevel } from './logger';
export const env = {
  username: process.env.API_USERNAME || '',
  password: process.env.API_PASSWORD || '',
  logLevelFromEnv: process.env.LOG_LEVEL || LogLevel.INFO
};

export function requireEnv(name: string, value: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
