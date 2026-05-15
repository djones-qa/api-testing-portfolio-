import { test, expect } from '@playwright/test';
import { createBooking, deleteBooking, defaultBooking } from '../utils/bookingHelpers';

/**
 * Filter / Query Param Tests
 * Covers: filtering bookings by name, checkin/checkout dates
 * Tags: @crud
 */
test.describe('Booking Filters', () => {
  test('GET /booking?firstname= filters by first name @crud', async ({ request }) => {
    const unique = `Filter${Date.now()}`;
    const created = await createBooking(request, defaultBooking({ firstname: unique }));

    const response = await request.get(`/booking?firstname=${unique}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.some((b: { bookingid: number }) => b.bookingid === created.bookingid)).toBe(true);

    await deleteBooking(request, created.bookingid);
  });

  test('GET /booking?checkin= filters by check-in date @crud', async ({ request }) => {
    const response = await request.get('/booking?checkin=2025-01-01');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /booking?checkout= filters by check-out date @crud', async ({ request }) => {
    const response = await request.get('/booking?checkout=2025-01-07');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
