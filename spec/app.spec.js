process.env.NODE_ENV = 'test';
const chai = require('chai');
chai.use(require('chai-sorted'));

const { expect } = chai;

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
      it('returns an error if an topic id/slug is inputted(not a topic route)', () => {
        return request
          .get('/api/topics/1')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Route Not Found');
          });
      });
    });
    describe('/articles', () => {
      describe('DEFAULT BEHAVIOURS', () => {
        it('GET returns status 200 and returns an array of objects of treasures', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).to.have.keys(
                'title',
                'topic',
                'author',
                'body',
                'created_at',
                'votes',
                'article_id'
              );
            });
        });
        it('articles to be in descending order by date by default', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('created_at');
            });
        });
      });
      describe('GET QUERIES', () => {
        it('accepts a sort query, to sort by author', () => {
          return request
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('author');
              expect(
                articles.every(article => article.author === 'butter_bridge')
              ).to.be.true;
            });
        });
        it('return an error when author does not exist', () => {
          return request
            .get('/api/articles?author=not_a_user')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Author: 'not_a_user' Not Found");
            });
        });
      });
    });
  });
});
