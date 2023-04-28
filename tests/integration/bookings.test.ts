import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker/locale/pt_BR';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createFullRoom, createUser, createValidBooking, createValidRoom } from '../factories';
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

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
  });
  describe('data is missing', () => {
    it('Should respond 404 if roomId is not sent', async () => {
      const token = await generateValidToken();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
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
  });
});
