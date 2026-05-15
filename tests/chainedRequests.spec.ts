import { test, expect } from '@playwright/test';
import { getAuthToken } from '../utils/auth';
import { createBooking, defaultBooking } from '../utils/bookingHelpers';

/**
 * Chained Request Tests
 * Demonstrates a full lifecycle: Create → Read → Update → Delete
 * The booking ID flows through each step — no hardcoded IDs.
 * Tags: @crud @smoke
 */
test('Full booking lifecycle — create → read → update → delete @crud @smoke', async ({ request }) => {
  const token = await getAuthToken(request);

  // ── STEP 1: Create ──────────────────────────────────────────────────────────
  const created = await createBooking(request, defaultBooking({
    firstname: 'Chain',
    lastname: 'Test',
    totalprice: 200,
  }));
  const id = created.bookingid;
  expect(id).toBeGreaterThan(0);

  // ── STEP 2: Read ────────────────────────────────────────────────────────────
  const getResponse = await request.get(`/booking/${id}`);
  expect(getResponse.status()).toBe(200);
  const fetched = await getResponse.json();
  expect(fetched.firstname).toBe('Chain');
  expect(fetched.totalprice).toBe(200);

  // ── STEP 3: Full Update (PUT) ────────────────────────────────────────────────
  const putResponse = await request.put(`/booking/${id}`, {
    data: defaultBooking({ firstname: 'Updated', lastname: 'Chain', totalprice: 300 }),
    headers: { Cookie: `token=${token}` },
  });
  expect(putResponse.status()).toBe(200);
  const updated = await putResponse.json();
  expect(updated.firstname).toBe('Updated');
  expect(updated.totalprice).toBe(300);

  // ── STEP 4: Partial Update (PATCH) ──────────────────────────────────────────
  const patchResponse = await request.patch(`/booking/${id}`, {
    data: { additionalneeds: 'Sea view room' },
    headers: { Cookie: `token=${token}` },
  });
  expect(patchResponse.status()).toBe(200);
  const patched = await patchResponse.json();
  expect(patched.additionalneeds).toBe('Sea view room');
  expect(patched.firstname).toBe('Updated'); // unchanged

  // ── STEP 5: Delete ───────────────────────────────────────────────────────────
  const deleteResponse = await request.delete(`/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });
  expect(deleteResponse.status()).toBe(201);

  // ── STEP 6: Confirm deletion ─────────────────────────────────────────────────
  const confirmResponse = await request.get(`/booking/${id}`);
  expect(confirmResponse.status()).toBe(404);
});
