import faker from '@faker-js/faker/locale/pt_BR';
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

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: Math.ceil(5 * Math.random()),
      hotelId,
    },
  });
}

export async function createRooms(hotelId: number, numberRooms: number) {
  const rooms = [];
  for (let i = 0; i < numberRooms; i++) {
    const room = await createRoom(hotelId);
    rooms.push(room);
  }
  return rooms;
}
