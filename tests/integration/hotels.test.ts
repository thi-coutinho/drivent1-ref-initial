import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker/locale/pt_BR';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createHotels,
  createRooms,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const fakeToken = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid but data is missing', () => {
    it('should respond with status 404 if there is no enrollment', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if there is no ticket', async () => {
      const user0 = await createUser();
      const token0 = await generateValidToken(user0);
      await createEnrollmentWithAddress(user0);
      const response0 = await server.get('/hotels').set('Authorization', `Bearer ${token0}`);

      expect(response0.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if there is no hotel', async () => {
      const user1 = await createUser();
      const token1 = await generateValidToken(user1);
      const enrollment1 = await createEnrollmentWithAddress(user1);
      const ticketType1 = await createTicketType(false, true);
      await createTicket(enrollment1.id, ticketType1.id, TicketStatus.PAID);

      const response1 = await server.get('/hotels').set('Authorization', `Bearer ${token1}`);

      expect(response1.status).toEqual(httpStatus.NOT_FOUND);
    });
  });

  describe('when token is valid, data is ok ', () => {
    it('should respond with status 402 if ticket not paid', async () => {
      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType2 = await createTicketType(false, true);
      await createTicket(enrollment2.id, ticketType2.id, TicketStatus.RESERVED);

      const response2 = await server.get('/hotels').set('Authorization', `Bearer ${token2}`);

      expect(response2.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 if ticket not includes hotel', async () => {
      const user3 = await createUser();
      const token3 = await generateValidToken(user3);
      const enrollment3 = await createEnrollmentWithAddress(user3);
      const ticketType3 = await createTicketType(false, false);
      await createTicket(enrollment3.id, ticketType3.id, TicketStatus.PAID);

      const response3 = await server.get('/hotels').set('Authorization', `Bearer ${token3}`);

      expect(response3.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 if ticket is remote', async () => {
      const user4 = await createUser();
      const token4 = await generateValidToken(user4);
      const enrollment4 = await createEnrollmentWithAddress(user4);
      const ticketType4 = await createTicketType(true, false);
      await createTicket(enrollment4.id, ticketType4.id, TicketStatus.PAID);

      const response4 = await server.get('/hotels').set('Authorization', `Bearer ${token4}`);

      expect(response4.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
  });
  describe('when is all good ', () => {
    it('should respond with status 200 and hotels list', async () => {
      const user5 = await createUser();
      const token5 = await generateValidToken(user5);
      const enrollment5 = await createEnrollmentWithAddress(user5);
      const ticketType5 = await createTicketType(false, true);
      await createTicket(enrollment5.id, ticketType5.id, TicketStatus.PAID);
      const hotels5 = await createHotels(3);
      const hotelsISO5 = hotels5.map((hotel) => {
        return { ...hotel, createdAt: hotel.createdAt.toISOString(), updatedAt: hotel.updatedAt.toISOString() };
      });
      const response5 = await server.get('/hotels').set('Authorization', `Bearer ${token5}`);
      expect(response5.status).toEqual(httpStatus.OK);
      expect(response5.body).toMatchObject(hotelsISO5);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const fakeToken = faker.lorem.word();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 404 if there is no enrollment', async () => {
    const token6 = await generateValidToken();
    const response6 = await server.get('/hotels/1').set('Authorization', `Bearer ${token6}`);

    expect(response6.status).toEqual(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if there is no ticket', async () => {
    const user7 = await createUser();
    const token7 = await generateValidToken(user7);
    await createEnrollmentWithAddress(user7);
    const response7 = await server.get('/hotels/1').set('Authorization', `Bearer ${token7}`);

    expect(response7.status).toEqual(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if there is no hotel', async () => {
    const user8 = await createUser();
    const token8 = await generateValidToken(user8);
    const enrollment8 = await createEnrollmentWithAddress(user8);
    const ticketType8 = await createTicketType(false, true);
    await createTicket(enrollment8.id, ticketType8.id, TicketStatus.PAID);

    const response8 = await server.get('/hotels/1').set('Authorization', `Bearer ${token8}`);

    expect(response8.status).toEqual(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 if ticket not paid', async () => {
    const user9 = await createUser();
    const token9 = await generateValidToken(user9);
    const enrollment9 = await createEnrollmentWithAddress(user9);
    const ticketType9 = await createTicketType(false, true);
    await createTicket(enrollment9.id, ticketType9.id, TicketStatus.RESERVED);

    const response9 = await server.get('/hotels/1').set('Authorization', `Bearer ${token9}`);

    expect(response9.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if ticket not includes hotel', async () => {
    const user11 = await createUser();
    const token11 = await generateValidToken(user11);
    const enrollment11 = await createEnrollmentWithAddress(user11);
    const ticketType11 = await createTicketType(false, false);
    await createTicket(enrollment11.id, ticketType11.id, TicketStatus.PAID);

    const response11 = await server.get('/hotels/1').set('Authorization', `Bearer ${token11}`);

    expect(response11.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if ticket is remote', async () => {
    const user12 = await createUser();
    const token12 = await generateValidToken(user12);
    const enrollment12 = await createEnrollmentWithAddress(user12);
    const ticketType12 = await createTicketType(true, false);
    await createTicket(enrollment12.id, ticketType12.id, TicketStatus.PAID);

    const response12 = await server.get('/hotels/1').set('Authorization', `Bearer ${token12}`);

    expect(response12.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });
  describe('when is all good ', () => {
    it('should respond with status 200 and hotels list', async () => {
      const user13 = await createUser();
      const token13 = await generateValidToken(user13);
      const enrollment13 = await createEnrollmentWithAddress(user13);
      const ticketType13 = await createTicketType(false, true);
      await createTicket(enrollment13.id, ticketType13.id, TicketStatus.PAID);
      const hotel13 = await createHotel();
      const rooms13 = await createRooms(hotel13.id, 3);
      const roomsISO13 = rooms13.map((room) => {
        return { ...room, createdAt: room.createdAt.toISOString(), updatedAt: room.updatedAt.toISOString() };
      });
      const hotelISOwithRomms = {
        ...hotel13,
        createdAt: hotel13.createdAt.toISOString(),
        updatedAt: hotel13.updatedAt.toISOString(),
        Rooms: roomsISO13,
      };
      const response13 = await server.get(`/hotels/${hotel13.id}`).set('Authorization', `Bearer ${token13}`);
      expect(response13.status).toEqual(httpStatus.OK);
      expect(response13.body).toMatchObject(hotelISOwithRomms);
    });
  });
});
