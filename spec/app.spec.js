process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it('checks that if there is `/notARoute` an error is thrown', () => {
    return request
      .get('/notARoute')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('Route Not Found');
      });
  });
  describe('/api', () => {
    it('returns error when incorrect method used', () => {
      return request
        .post('/api')
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Method Not Allowed');
        });
    });
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe('/topics', () => {
      it('GET returns status 200 and returns an array of objects of topics', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics[0]).to.have.all.keys('description', 'slug');
          });
      });
    });
  });
});
