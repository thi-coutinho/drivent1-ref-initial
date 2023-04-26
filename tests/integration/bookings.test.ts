import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker/locale/pt_BR';
import * as jwt from 'jsonwebtoken';
import { cleanDb } from '../helpers';
import { createUser } from '../factories';
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
});
