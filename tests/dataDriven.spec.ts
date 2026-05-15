import { test, expect } from '@playwright/test';
import { createBooking, deleteBooking, defaultBooking } from '../utils/bookingHelpers';

/**
 * Data-Driven Tests
 * Runs the same booking creation assertions across multiple guest profiles.
 * Tags: @data-driven
 */

interface GuestProfile {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  additionalneeds: string;
}

const guestProfiles: GuestProfile[] = [
  { firstname: 'Alice', lastname: 'Smith', totalprice: 100, depositpaid: true, additionalneeds: 'Breakfast' },
  { firstname: 'Bob', lastname: 'Jones', totalprice: 250, depositpaid: false, additionalneeds: 'Late checkout' },
  { firstname: 'Carol', lastname: 'White', totalprice: 0, depositpaid: true, additionalneeds: 'None' },
  { firstname: 'Dave', lastname: 'Brown', totalprice: 9999, depositpaid: false, additionalneeds: 'Airport transfer' },
  { firstname: 'Eve', lastname: 'Davis', totalprice: 75, depositpaid: true, additionalneeds: 'Extra pillows' },
];

for (const guest of guestProfiles) {
  test(`POST /booking — creates booking for ${guest.firstname} ${guest.lastname} @data-driven`, async ({ request }) => {
    const payload = defaultBooking({
      firstname: guest.firstname,
      lastname: guest.lastname,
      totalprice: guest.totalprice,
      depositpaid: guest.depositpaid,
      additionalneeds: guest.additionalneeds,
    });

    const body = await createBooking(request, payload);

    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking.firstname).toBe(guest.firstname);
    expect(body.booking.lastname).toBe(guest.lastname);
    expect(body.booking.totalprice).toBe(guest.totalprice);
    expect(body.booking.depositpaid).toBe(guest.depositpaid);
    expect(body.booking.additionalneeds).toBe(guest.additionalneeds);

    // Cleanup
    await deleteBooking(request, body.bookingid);
  });
}
