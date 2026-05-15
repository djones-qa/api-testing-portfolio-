import { APIRequestContext } from '@playwright/test';
import { getAuthToken } from './auth';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

/** Creates a booking and returns the full response including the generated ID. */
export async function createBooking(
  request: APIRequestContext,
  payload: Booking
): Promise<BookingResponse> {
  const response = await request.post('/booking', { data: payload });
  if (!response.ok()) {
    throw new Error(`createBooking failed: ${response.status()} ${await response.text()}`);
  }
  return response.json();
}

/** Deletes a booking by ID using cookie auth. */
export async function deleteBooking(
  request: APIRequestContext,
  bookingId: number
): Promise<void> {
  const token = await getAuthToken(request);
  const response = await request.delete(`/booking/${bookingId}`, {
    headers: { Cookie: `token=${token}` },
  });
  if (response.status() !== 201) {
    throw new Error(`deleteBooking failed: ${response.status()} ${await response.text()}`);
  }
}

/** Returns a default booking payload with optional overrides. */
export function defaultBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'Test',
    lastname: 'User',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-07',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
