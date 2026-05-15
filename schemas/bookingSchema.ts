import { JSONSchemaType } from 'ajv';
import { Booking, BookingResponse } from '../utils/bookingHelpers';

export const bookingDatesSchema = {
  type: 'object',
  properties: {
    checkin: { type: 'string' },
    checkout: { type: 'string' },
  },
  required: ['checkin', 'checkout'],
  additionalProperties: false,
};

export const bookingSchema: JSONSchemaType<Booking> = {
  type: 'object',
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      properties: {
        checkin: { type: 'string' },
        checkout: { type: 'string' },
      },
      required: ['checkin', 'checkout'],
      additionalProperties: false,
    },
    additionalneeds: { type: 'string', nullable: true },
  },
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  additionalProperties: false,
};

export const bookingResponseSchema: JSONSchemaType<BookingResponse> = {
  type: 'object',
  properties: {
    bookingid: { type: 'number' },
    booking: bookingSchema,
  },
  required: ['bookingid', 'booking'],
  additionalProperties: false,
};
