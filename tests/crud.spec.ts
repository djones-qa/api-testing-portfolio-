import { test, expect } from '@playwright/test';
import { getAuthToken } from '../utils/auth';
import { createBooking, deleteBooking, defaultBooking } from '../utils/bookingHelpers';

/**
 * CRUD Tests — Chained requests
 * Flow: Create → Read → Update (PUT) → Partial Update (PATCH) → Delete
 * Tags: @crud @smoke
 */
test.describe('Booking CRUD', () => {
  let bookingId: number;

  // ── CREATE ──────────────────────────────────────────────────────────────────
  test('POST /booking — creates a new booking @crud @smoke', async ({ request }) => {
    const payload = defaultBooking({ firstname: 'James', lastname: 'Jones' });
    const body = await createBooking(request, payload);

    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe('James');
    expect(body.booking.lastname).toBe('Jones');
    expect(body.booking.depositpaid).toBe(true);

    bookingId = body.bookingid;
  });

  // ── READ ─────────────────────────────────────────────────────────────────────
  test('GET /booking/:id — retrieves the created booking @crud', async ({ request }) => {
    // Create a fresh booking so this test is self-contained
    const created = await createBooking(request, defaultBooking({ firstname: 'Read', lastname: 'Test' }));
    bookingId = created.bookingid;

    const response = await request.get(`/booking/${bookingId}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.firstname).toBe('Read');
    expect(body.lastname).toBe('Test');

    await deleteBooking(request, bookingId);
  });

  // ── READ ALL ─────────────────────────────────────────────────────────────────
  test('GET /booking — returns a list of booking IDs @crud @smoke', async ({ request }) => {
    const response = await request.get('/booking');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });

  // ── FULL UPDATE (PUT) ────────────────────────────────────────────────────────
  test('PUT /booking/:id — fully updates a booking @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;
    const token = await getAuthToken(request);

    const updated = defaultBooking({
      firstname: 'Updated',
      lastname: 'Name',
      totalprice: 999,
    });

    const response = await request.put(`/booking/${id}`, {
      data: updated,
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Updated');
    expect(body.totalprice).toBe(999);

    await deleteBooking(request, id);
  });

  // ── PARTIAL UPDATE (PATCH) ───────────────────────────────────────────────────
  test('PATCH /booking/:id — partially updates a booking @crud', async ({ request }) => {
    const created = await createBooking(request, defaultBooking({ firstname: 'Original' }));
    const id = created.bookingid;
    const token = await getAuthToken(request);

    const response = await request.patch(`/booking/${id}`, {
      data: { firstname: 'Patched' },
      headers: { Cookie: `token=${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Patched');
    // Other fields should remain unchanged
    expect(body.lastname).toBe('User');

    await deleteBooking(request, id);
  });

  // ── DELETE ───────────────────────────────────────────────────────────────────
  test('DELETE /booking/:id — deletes a booking @crud @smoke', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;
    const token = await getAuthToken(request);

    const deleteResponse = await request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteResponse.status()).toBe(201);

    // Confirm it's gone
    const getResponse = await request.get(`/booking/${id}`);
    expect(getResponse.status()).toBe(404);
  });
});
