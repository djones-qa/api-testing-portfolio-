import { test, expect } from '@playwright/test';

/**
 * Auth Tests
 * Covers: token generation, invalid credentials, missing fields
 * Tags: @auth @smoke
 */
test.describe('Authentication', () => {
  test('returns a token with valid credentials @auth @smoke', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('returns "Bad credentials" with wrong password @auth', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrongpassword' },
    });

    expect(response.status()).toBe(200); // API returns 200 with error body
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });

  test('returns error with missing username @auth', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { password: 'password123' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
