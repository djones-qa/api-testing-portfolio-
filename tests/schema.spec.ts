import { test, expect } from '@playwright/test';
import { createBooking, deleteBooking, defaultBooking } from '../utils/bookingHelpers';
import { validateSchema } from '../utils/schemaValidator';
import { bookingResponseSchema, bookingSchema } from '../schemas/bookingSchema';

/**
 * Schema Validation Tests
 * Verifies API responses conform to expected JSON shapes.
 * Tags: @schema
 */
test.describe('Schema Validation', () => {
  test('POST /booking response matches booking response schema @schema', async ({ request }) => {
    const payload = defaultBooking();
    const body = await createBooking(request, payload);

    // Will throw if schema is violated
    validateSchema(body, bookingResponseSchema);
    expect(body.bookingid).toBeGreaterThan(0);

    await deleteBooking(request, body.bookingid);
  });

  test('GET /booking/:id response matches booking schema @schema', async ({ request }) => {
    const created = await createBooking(request, defaultBooking());
    const id = created.bookingid;

    const response = await request.get(`/booking/${id}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    validateSchema(body, bookingSchema);

    await deleteBooking(request, id);
  });

  test('GET /booking returns array of objects with bookingid @schema', async ({ request }) => {
    const response = await request.get('/booking');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);

    // Validate each item has the expected shape
    for (const item of body.slice(0, 5)) {
      expect(typeof item.bookingid).toBe('number');
    }
  });
});
