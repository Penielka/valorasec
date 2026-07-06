import { ValoraSecClient } from '@valorasec/sdk';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api = new ValoraSecClient({
  baseUrl: API_BASE_URL,
});

export function getApiClient(): ValoraSecClient {
  return api;
}
