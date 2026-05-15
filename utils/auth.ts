import { APIRequestContext } from '@playwright/test';

/**
 * Fetches a Bearer token from the Restful Booker auth endpoint.
 * Caches the token for the duration of the test run.
 */
let cachedToken: string | null = null;

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  if (cachedToken) return cachedToken;

  const response = await request.post('/auth', {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });

  if (!response.ok()) {
    throw new Error(`Auth failed: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json();
  cachedToken = body.token as string;
  return cachedToken;
}

/** Clears the cached token (useful between test suites if needed). */
export function clearAuthToken(): void {
  cachedToken = null;
}
