import faker from '@faker-js/faker/locale/pt_BR';
import { TicketStatus } from '@prisma/client';
import { createUser } from './users-factory';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createTicket, createTicketType } from './tickets-factory';
import { createBooking } from './bookings-factory';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: faker.image.imageUrl(),
      name: faker.name.findName(),
    },
  });
}

export async function createHotels(numberHotels: number) {
  const hotels = [];
  for (let i = 0; i < numberHotels; i++) {
    const hotel = await createHotel();
    hotels.push(hotel);
  }
  return hotels;
}

export async function createRoom(hotelId: number, capacity?: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: capacity ?? Math.ceil(5 * Math.random()),
      hotelId,
    },
  });
}

export async function createRooms(hotelId: number, numberRooms: number, capacity?: number) {
  const rooms = [];
  for (let i = 0; i < numberRooms; i++) {
    const room = await createRoom(hotelId, capacity);
    rooms.push(room);
  }
  return rooms;
}

export async function createValidRoom(numberRooms?: number, capacity?: number) {
  const hotel = await createHotel();
  const rooms = await createRooms(hotel.id, numberRooms ?? 1, capacity);
  return rooms[0];
}

export async function createFullRoom() {
  const user = await createUser();
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(false, true);
  await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  const room = await createValidRoom(1, 1);
  return await createBooking(user.id, room.id);
}
