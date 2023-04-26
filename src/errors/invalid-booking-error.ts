import { ApplicationError } from '@/protocols';

export function invalidBookingError(): ApplicationError {
  return {
    name: 'InvalidBookingError',
    message: "Can't proceed: invalid Ticket or Ticket Type",
  };
}
