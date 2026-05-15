import { test, expect } from '@playwright/test';
import { getAuthToken } from '../utils/auth';
import { createBooking, deleteBooking, defaultBooking } from '../utils/bookingHelpers';

/**
 * Negative / Edge Case Tests
 * Covers: 404s, auth failures, invalid payloads
 * Tags: @crud
 */
test.describe('Negative Tests', () => {
  test('GET /booking/:id — returns 404 for non-existent booking @crud', async ({ request }) => {
    const response = await request.get('/booking/999999999');
    expect(response.status()).toBe(404);
  });

  test('DELETE /booking/:id — returns 403 without auth token @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;

    const response = await request.delete(`/booking/${id}`);
    expect(response.status()).toBe(403);

    // Cleanup with valid token
    await deleteBooking(request, id);
  });

  test('PUT /booking/:id — returns 403 with invalid token @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;

    const response = await request.put(`/booking/${id}`, {
      data: defaultBooking({ firstname: 'Hacker' }),
      headers: { Cookie: 'token=invalidtoken123' },
    });

    expect(response.status()).toBe(403);

    await deleteBooking(request, id);
  });

  test('PATCH /booking/:id — returns 403 without auth @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;

    const response = await request.patch(`/booking/${id}`, {
      data: { firstname: 'NoAuth' },
    });

    expect(response.status()).toBe(403);

    await deleteBooking(request, id);
  });

  test('GET /booking/:id — returns 404 after deletion @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;
    const token = await getAuthToken(request);

    await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });

    const response = await request.get(`/booking/${id}`);
    expect(response.status()).toBe(404);
  });
});
