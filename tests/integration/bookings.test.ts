import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker/locale/pt_BR';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createFullRoom,
  createTicket,
  createTicketType,
  createUser,
  createValidBooking,
  createValidRoom,
  getBooking,
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
      const booking = await createValidBooking(user);
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

describe('POST /booking', () => {
  describe('failed Authentication', () => {
    it('Should respond 401 if not auth', async () => {
      const room = await createValidRoom();
      const response = await server.post('/booking').send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('Should respond 401 if token is not valid', async () => {
      const fakeToken = faker.datatype.string(12);
      const room = await createValidRoom();
      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const room = await createValidRoom();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
  });
  describe('data is missing', () => {
    it('Should respond 400 if roomId is not sent', async () => {
      const token = await generateValidToken();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
  describe('data is invalid', () => {
    it('Should respond 404 if roomId is invalid', async () => {
      const token = await generateValidToken();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('Should respond 403 if room is full', async () => {
      const token = await generateValidToken();
      const fullRoom = await createFullRoom();
      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: fullRoom.roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('Should respond 403 if user doesn`t have ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const room = await createValidRoom();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('Should respond 403 if ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createValidRoom();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('Should respond 403 if ticket doesn`t include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createValidRoom();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
  describe('success case', () => {
    it('Should respond 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createValidRoom();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject(expect.objectContaining({ bookingId: expect.any(Number) }));
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  describe('failed Authentication', () => {
    it('Should respond 401 if not auth', async () => {
      const room = await createValidRoom();
      const response = await server.put('/booking/1').send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('Should respond 401 if token is not valid', async () => {
      const fakeToken = faker.datatype.string(12);
      const room = await createValidRoom();
      const response = await server
        .put('/booking/1')
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should respond 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const room = await createValidRoom();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
  });
  describe('data is missing', () => {
    it('Should respond 400 if roomId is not sent', async () => {
      const token = await generateValidToken();
      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('Should respond 400 if bookingId is not number', async () => {
      const token = await generateValidToken();
      const room = await createValidRoom();
      const response = await server.put('/booking/a').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
  describe('data is invalid', () => {
    it('Should respond 404 if roomId is invalid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const oldBooking = await createValidBooking(user);

      const response = await server
        .put(`/booking/${oldBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('Should respond 403 if room is full', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const oldBooking = await createValidBooking(user);
      const fullRoom = await createFullRoom();
      const response = await server
        .put(`/booking/${oldBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: fullRoom.roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it('Should respond 403 if user doesn`t have booking', async () => {
      const user = await createUser();
      const otherUser = await createUser();
      const token = await generateValidToken(user);
      const otherBooking = await createValidBooking(otherUser);
      const room = await createValidRoom();
      const response = await server
        .put(`/booking/${otherBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
  describe('success case', () => {
    it('Should respond 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const oldBooking = await createValidBooking(user);
      const room = await createValidRoom();
      const response = await server
        .put(`/booking/${oldBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });
      const newBooking = await getBooking(user);

      expect(response.body).toMatchObject(expect.objectContaining({ bookingId: newBooking.id }));
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});
