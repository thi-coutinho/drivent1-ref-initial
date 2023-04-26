import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker/locale/pt_BR';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRooms,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => await init());
afterEach(async () => await cleanDb());

describe('GET /booking', () => {
  describe('failed Authentication', () => {
    it('Should respond 401 if not auth', async () => {
      const response = await server.get('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('Should respond 401 if token is not valid', async () => {
      const fakeToken = faker.datatype.string(12);
      const response = await server.get('/booking').set('Authorization', `Bearer ${fakeToken}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
  });

  describe('data is missing', () => {
    it('Should respond 404 if no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
  describe('success case', () => {
    it('Should respond 200 and booking info', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const rooms = await createRooms(hotel.id, 3);
      const booking = await createBooking(user.id, rooms[0].id);
      const expectedOutput = {
        id: booking.id,
        Room: {
          ...booking.Room,
          updatedAt: booking.Room.updatedAt.toISOString(),
          createdAt: booking.Room.createdAt.toISOString(),
        },
      };
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual(expectedOutput);
    });
  });
});
