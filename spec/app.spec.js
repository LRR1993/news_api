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
  describe('ERROS', () => {
    it('checks that if there is `/notARoute` an error is thrown', () => {
      return request
        .get('/notARoute')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Route Not Found');
        });
    });
  });
  describe('/api', () => {
    describe('ERRORS', () => {
      it('returns error when incorrect method used', () => {
        return request
          .post('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Method Not Allowed');
          });
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
        it('GET returns status 200 and returns an array of objects of articles', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).to.contain.keys(
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
        it('GET returns status 200 and returns comment count in relation to articles', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).to.contain.keys('comment_count');
              expect(articles[0].comment_count).to.equal(13);
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
        it('accepts a sort query, to sort by topic', () => {
          return request
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('topic');
              expect(articles.every(article => article.topic === 'mitch')).to.be
                .true;
            });
        });
        it('articles to be in asc order by date by default', () => {
          return request
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy('created_at');
            });
        });
        it('accepts a sort query, to sort by votes', () => {
          return request
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('votes');
            });
        });
      });
      describe('ERROR HANDLING', () => {
        it('return an error when author does not exist', () => {
          return request
            .get('/api/articles?author=not_a_user')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request: 'not_a_user' Not Found");
            });
        });
        it('return an error when topic does not exist', () => {
          return request
            .get('/api/articles?topic=notATopic')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad Request: 'notATopic' Not Found");
            });
        });
        it('returns an error when not a valid search parameter is queired', () => {
          return request
            .get('/api/articles?sort_by=notAColumn')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`Error Code: 42703`);
            });
        });
        it('returns default behavior, when order query invalid', () => {
          return request
            .get('/api/articles?order=notADirection')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('created_at');
            });
        });
      });
      describe('/article_id', () => {
        describe('DEFAULT BEHAVIOURS', () => {
          it('GET returns status 200 and returns an article object', () => {
            return request
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  'title',
                  'topic',
                  'author',
                  'body',
                  'created_at',
                  'votes',
                  'article_id',
                  'comment_count'
                );
                expect(article.comment_count).to.equal(13);
              });
          });
          it('PATCHES the voyes of a article to increase the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 1 })
              .expect(201)
              .then(res => {
                expect(res.body.article).to.eql([
                  {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2018-11-15T12:21:54.171Z',
                    votes: 101
                  }
                ]);
              });
          });
          it('PATCHES the votes of a article to reduce the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: -1 })
              .expect(201)
              .then(res => {
                expect(res.body.article).to.eql([
                  {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2018-11-15T12:21:54.171Z',
                    votes: 99
                  }
                ]);
              });
          });
          it('DELETES specfic articles for the id given', () => {
            return request.delete('/api/articles/1').expect(204);
          });
        });
        describe('ERROR HANDLING', () => {
          it('return an error when id does not exist', () => {
            return request
              .get('/api/articles/99999999')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("User: '99999999' Not Found");
              });
          });
          it('return an error when id does not exist', () => {
            return request
              .get('/api/articles/notAuser')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Error Code: 22P02`);
              });
          });
          it('returns and error when body is empty', () => {
            return request
              .patch('/api/articles/1')
              .send({})
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(
                  'Bad Request: malformed body / missing required fields'
                );
              });
          });
          it('returns and error when body is the wrong type', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 'wrongType' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Error Code: 22P02`);
              });
          });
          it('return an error when id to be deleted does not exist', () => {
            return request
              .delete('/api/articles/99999999')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("User: '99999999' Not Found");
              });
          });
          it('return an error when id does to be deleted does not exist', () => {
            return request
              .delete('/api/articles/notAuser')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Error Code: 22P02`);
              });
          });
        });
      });
    });
    describe('/users', () => {
      describe('/:username', () => {
        it('GET returns status 200 and returns an array of objects of users', () => {
          return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.have.all.keys('username', 'avatar_url', 'name');
            });
        });
      });
    });
  });
});
