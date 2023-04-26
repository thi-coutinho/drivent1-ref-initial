import { ApplicationError } from '@/protocols';

export function roomFullyBookedError(): ApplicationError {
  return {
    name: 'RoomFullyBookedError',
    message: "Can't proceed: room fully booked",
  };
}
