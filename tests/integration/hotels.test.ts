import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
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
afterAll(async () => {
  await cleanDb();
});
afterEach(async () => {
  await cleanDb();
});
const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const fakeToken = faker.lorem.word();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid but data is missing', () => {
    it('should respond with status 404 if there is no enrollment', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if there is no ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 404 if there is no hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });

  describe('when token is valid, data is ok ', () => {
    it('should respond with status 402 if ticket not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 if ticket not includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 402 if ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
  });
  describe('when is all good ', () => {
    it('should respond with status 200 and hotels list', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotels = await createHotels(3);
      const hotelsISO = hotels.map((hotel) => {
        return { ...hotel, createdAt: hotel.createdAt.toISOString(), updatedAt: hotel.updatedAt.toISOString() };
      });
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(hotelsISO);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with status 401 if token is invalid', async () => {
    const fakeToken = faker.lorem.word();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 404 if there is no enrollment', async () => {
    const token = await generateValidToken();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if there is no ticket', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if there is no hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 if ticket not paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if ticket not includes hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  describe('when is all good ', () => {
    it('should respond with status 200 and hotels list', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const rooms = await createRooms(hotel.id, 3);
      const hotelISOwithRomms = {
        ...hotel,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString(),
        Rooms: rooms,
      };
      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(hotelISOwithRomms);
    });
  });
});
