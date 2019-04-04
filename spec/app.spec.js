/* eslint-disable no-unused-expressions */
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
  describe('ERRORS', () => {
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
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            topics: 'shows a list of topics',
            articles: {
              id: 'shows a specfic article',
              article_id: {
                coments: 'show or add new a new comment for an article'
              }
            },
            comments:
              'update or delete a specfic comment relation to an article',
            users: 'shows all users'
          });
        });
    });
    describe('ERRORS', () => {
      it('checks that if there is `/notARoute` an error is thrown', () => {
        return request
          .get('/api/notARoute')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Route Not Found');
          });
      });
      it('returns error when incorrect method used', () => {
        const notMethods = ['delete', 'put', 'patch', 'post'];
        return Promise.all(
          notMethods.map(method => {
            return request[method]('/api')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('Method Not Allowed');
              });
          })
        );
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
      describe('ERRORS', () => {
        it('checks that if there is `/notARoute` an error is thrown', () => {
          return request
            .get('/api/topics/notARoute')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Route Not Found');
            });
        });
        it('returns error when incorrect method used', () => {
          const notMethods = ['delete', 'put', 'patch', 'post'];
          return Promise.all(
            notMethods.map(method => {
              return request[method]('/api/topics')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('Method Not Allowed');
                });
            })
          );
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
        it('display the total number of articles with any filters applied, discounting the limit', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).to.be.equal('12');
            });
        });
        it('display the total number of articles with any filters applied, discounting the limit', () => {
          return request
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(({ body: { total_count } }) => {
              expect(total_count).to.be.equal('6');
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
        it('articles limit of 10', () => {
          return request
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.be.below(11);
            });
        });
      });
      describe('GET QUERIES', () => {
        it("accepts a page query 'p=2'", () => {
          return request
            .get('/api/articles?p=2')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(2);
              expect(articles[0]).to.eql({
                title: 'Am I a cat?',
                topic: 'mitch',
                author: 'icellusedkars',
                body:
                  'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
                created_at: '1978-11-25T12:21:54.171Z',
                votes: 0,
                article_id: 11,
                comment_count: 0
              });
            });
        });
        it("accepts a page query'p=1'", () => {
          return request
            .get('/api/articles?p=1')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(10);
              expect(articles[0]).to.eql({
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2018-11-15T12:21:54.171Z',
                votes: 100,
                article_id: 1,
                comment_count: 13
              });
            });
        });
        it('accept page and limit query', () => {
          return request
            .get('/api/articles?p=2&limit=5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(5);
              expect(articles[0]).to.eql({
                title: 'A',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'Delicious tin of cat food',
                votes: 0,
                article_id: 6,
                comment_count: 1,
                created_at: '1998-11-20T12:21:54.171Z'
              });
            });
        });
        it('accepts a limit query of 5', () => {
          return request
            .get('/api/articles?limit=5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.equal(5);
            });
        });
        it('accepts a filter query, to sort by author', () => {
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
        it('accepts a filter query, to sort by topic', () => {
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
        it('defaults to articles page 1, when invalid query entered', () => {
          return request
            .get('/api/articles?p=notanum')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.be.below(11);
              expect(articles[9]).to.eql({
                title: 'Seven inspirational thought leaders from Manchester UK',
                topic: 'mitch',
                author: 'rogersop',
                body: "Who are we kidding, there is only one, and it's Mitch!",
                created_at: '1982-11-24T12:21:54.171Z',
                votes: 0,
                article_id: 10,
                comment_count: 0
              });
            });
        });
        it('defaults to articles page 1, when invalid query entered', () => {
          return request
            .get('/api/articles?p=-1')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.be.below(11);
            });
        });
        it('returns empty array when page number out of range if articles', () => {
          return request
            .get('/api/articles?p=5')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.eql([]);
            });
        });
        it('defaults to articles limit of 10, when invalid query entered', () => {
          return request
            .get('/api/articles?limit=notanum')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.be.below(11);
            });
        });
        it('defaults to articles limit of 10, when invalid query entered', () => {
          return request
            .get('/api/articles?limit=-1')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.be.below(11);
            });
        });
        it('return an empty array when author does not exist', () => {
          return request
            .get('/api/articles?author=not_a_user')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.eql([]);
            });
        });
        it('return an empty array when topic does not exist', () => {
          return request
            .get('/api/articles?topic=notATopic')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.eql([]);
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
        describe('ERRORS-Route Methods', () => {
          it('returns error when incorrect method used', () => {
            const notMethods = ['delete', 'put', 'patch', 'post'];
            return Promise.all(
              notMethods.map(method => {
                return request[method]('/api/articles')
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Method Not Allowed');
                  });
              })
            );
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
          it('PATCHES the votes of a article to increase the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.eql({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  body: 'I find this existence challenging',
                  created_at: '2018-11-15T12:21:54.171Z',
                  votes: 101
                });
              });
          });
          it('PATCHES the votes of a article to reduce the votes', () => {
            return request
              .patch('/api/articles/1')
              .send({ inc_votes: -1 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.eql({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  body: 'I find this existence challenging',
                  created_at: '2018-11-15T12:21:54.171Z',
                  votes: 99
                });
              });
          });
          it('DELETES specfic articles for the id given', () => {
            return request.delete('/api/articles/1').expect(204);
          });
        });
        describe('ERROR HANDLING', () => {
          describe('ERRORS-Route Methods', () => {
            it('returns error when incorrect method used', () => {
              const notMethods = ['put', 'post'];
              return Promise.all(
                notMethods.map(method => {
                  return request[method]('/api/articles/1')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal('Method Not Allowed');
                    });
                })
              );
            });
          });
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

        describe('/comments', () => {
          describe('DEFAULTS', () => {
            it('GET returns status 200 and returns an array of objects of comments', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments[0]).to.have.all.keys(
                    'comment_id',
                    'votes',
                    'created_at',
                    'author',
                    'body'
                  );
                });
            });
            it('articles limit of 10', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.be.below(11);
                });
            });
            it('comments are ordered to be descedning by created_at', () => {
              return request
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('created_at');
                });
            });
          });
          describe('POST', () => {
            it('posts a new comment to the corresponding article id', () => {
              return request
                .post('/api/articles/1/comments')
                .send({
                  username: 'butter_bridge',
                  body: 'This is awesome'
                })
                .expect(201)
                .then(({ body: { comment } }) => {
                  expect(comment).to.have.keys(
                    'comment_id',
                    'author',
                    'article_id',
                    'votes',
                    'body',
                    'created_at'
                  );
                  expect(comment.author).to.equal('butter_bridge');
                  expect(comment.comment_id).to.equal(19);
                  expect(comment.body).to.equal('This is awesome');
                });
            });
          });
          describe('GET QUERIES', () => {
            it("accepts a page query 'p=2'", () => {
              return request
                .get('/api/articles/1/comments?p=2')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.equal(3);
                  expect(comments[0]).to.eql({
                    author: 'icellusedkars',
                    body: 'Massive intercranial brain haemorrhage',
                    created_at: '2006-11-25T12:36:03.389Z',
                    votes: 0,
                    comment_id: 12
                  });
                });
            });
            it("accepts a page query'p=1'", () => {
              return request
                .get('/api/articles/1/comments?p=1')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.equal(10);
                  expect(comments[0]).to.eql({
                    author: 'butter_bridge',
                    body:
                      'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                    created_at: '2016-11-22T12:36:03.389Z',
                    votes: 14,
                    comment_id: 2
                  });
                });
            });
            it('accept page and limit query', () => {
              return request
                .get('/api/articles/1/comments?p=2&limit=5')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.equal(5);
                  expect(comments[0]).to.eql({
                    author: 'icellusedkars',
                    body: 'Lobster pot',
                    created_at: '2011-11-24T12:36:03.389Z',
                    votes: 0,
                    comment_id: 7
                  });
                });
            });
            it('accepts a limit query of 5', () => {
              return request
                .get('/api/articles/1/comments?limit=5')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.equal(5);
                });
            });
            it('can set the order to be ascending by created_at', () => {
              return request
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.ascendingBy('created_at');
                });
            });
            it('can sort by votes(defaults to descending order)', () => {
              return request
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('votes');
                });
            });
            it('can sort by comment_id(defaults to descending order)', () => {
              return request
                .get('/api/articles/1/comments?sort_by=comment_id')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('comment_id');
                });
            });
            it('can sort by author(defaults to descending order)', () => {
              return request
                .get('/api/articles/1/comments?sort_by=author')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments[0]).to.be.eql({
                    author: 'icellusedkars',
                    body: 'Fruit pastilles',
                    created_at: '2005-11-25T12:36:03.389Z',
                    votes: 0,
                    comment_id: 13
                  });
                  expect(comments.slice(-1)[0]).to.eql({
                    author: 'icellusedkars',
                    body: 'Ambidextrous marsupial',
                    created_at: '2007-11-25T12:36:03.389Z',
                    votes: 0,
                    comment_id: 11
                  });
                });
            });
          });
          describe('ERROR HANDLING', () => {
            describe('ERRORS-Route Methods', () => {
              it('returns error when incorrect method used', () => {
                const notMethods = ['delete', 'put', 'patch'];
                return Promise.all(
                  notMethods.map(method => {
                    return request[method]('/api/articles/1/comments')
                      .expect(405)
                      .then(({ body: { msg } }) => {
                        expect(msg).to.equal('Method Not Allowed');
                      });
                  })
                );
              });
            });
            it('defaults to articles page 1, when invalid query entered', () => {
              return request
                .get('/api/articles/1/comments?p=notanum')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.be.below(11);
                  expect(comments[9]).to.eql({
                    author: 'icellusedkars',
                    body: 'Ambidextrous marsupial',
                    created_at: '2007-11-25T12:36:03.389Z',
                    votes: 0,
                    comment_id: 11
                  });
                });
            });
            it('defaults to articles page 1, when invalid query entered', () => {
              return request
                .get('/api/articles/1/comments?p=-1')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.be.below(11);
                });
            });
            it('returns empty array when page number out of range if articles', () => {
              return request
                .get('/api/articles/1/comments?p=5')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.eql([]);
                });
            });
            it('defaults to articles limit of 10, when invalid query entered', () => {
              return request
                .get('/api/articles/1/comments?limit=notanum')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.be.below(11);
                });
            });
            it('defaults to articles limit of 10, when invalid query entered', () => {
              return request
                .get('/api/articles/1/comments?limit=-1')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.be.below(11);
                });
            });
            it('cant post a comment for a user that doesnt exist', () => {
              return request
                .post('/api/articles/1/comments')
                .send({
                  username: 'not_exist',
                  body: 'This is awesome'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.eql('Error Code: 23503');
                });
            });
            it('returns an error when not a valid search parameter is queired', () => {
              return request
                .get('/api/articles/1/comments?sort_by=notAColumn')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(`Error Code: 42703`);
                });
            });
            it('returns default behavior, when order query invalid', () => {
              return request
                .get('/api/articles/1/comments?order=notADirection')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy('created_at');
                });
            });
            it('return an error when id does not exist', () => {
              return request
                .get('/api/articles/99999999/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.eql([]);
                });
            });
            it('return an error when id does not exist', () => {
              return request
                .get('/api/articles/notAuser/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(`Error Code: 22P02`);
                });
            });
            it('cant post to an id that doesnt exist, returns an error', () => {
              return request
                .post('/api/articles/99999999/comments')
                .send({
                  username: 'butter_bridge',
                  body: 'This is awesome'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(`Error Code: 23503`);
                });
            });
            it('cant post to an id of the wrong type, returns', () => {
              return request
                .post('/api/articles/notAuser/comments')
                .send({
                  username: 'butter_bridge',
                  body: 'This is awesome'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(`Error Code: 22P02`);
                });
            });
            it('returns and error when body is empty', () => {
              return request
                .post('/api/articles/1/comments')
                .send({})
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(
                    'Bad Request: malformed body / missing required fields'
                  );
                });
            });
            it('returns and error when body isnt given', () => {
              return request
                .post('/api/articles/1/comments')
                .send({
                  username: 'butter_bridge'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal(
                    'Bad Request: malformed body / missing required fields'
                  );
                });
            });
          });
        });
      });
    });
    describe('/users', () => {
      it('GET returns status 200 and returns an array of objects of users', () => {
        return request
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users[0]).to.have.all.keys('username', 'name', 'avatar_url');
          });
      });
      it('posts a new user ', () => {
        return request
          .post('/api/users')
          .send({
            username: 'tisha1993',
            name: 'tish',
            avatar_url:
              'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).to.eql({
              username: 'tisha1993',
              name: 'tish',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            });
          });
      });
      describe('ERRORS', () => {
        it('returns and error when body is empty', () => {
          return request
            .post('/api/users')
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Error Code: 23502');
            });
        });
        it('returns and error when body isnt given', () => {
          return request
            .post('/api/users')
            .send({
              username: 'tish'
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Error Code: 23502');
            });
        });
        describe('ERRORS-Route Methods', () => {
          it('returns error when incorrect method used', () => {
            const notMethods = ['delete', 'put', 'patch'];
            return Promise.all(
              notMethods.map(method => {
                return request[method]('/api/users/')
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Method Not Allowed');
                  });
              })
            );
          });
        });
      });

      describe('/:username', () => {
        it('GET returns status 200 and returns an array of objects of users', () => {
          return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.have.all.keys('username', 'avatar_url', 'name');
            });
        });
        describe('ERROR HANDLING', () => {
          describe('ERRORS-Route Methods', () => {
            it('returns error when incorrect method used', () => {
              const notMethods = ['delete', 'put', 'patch', 'post'];
              return Promise.all(
                notMethods.map(method => {
                  return request[method]('/api/users/1')
                    .expect(405)
                    .then(({ body: { msg } }) => {
                      expect(msg).to.equal('Method Not Allowed');
                    });
                })
              );
            });
          });
          it('return an error when id is the wrong type', () => {
            return request
              .get('/api/users/99999999')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`Bad Request: '99999999' invalid input`);
              });
          });
          it('return an error when id does not exist', () => {
            return request
              .get('/api/users/notAuser')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal(`User: 'notAuser' Not Found`);
              });
          });
        });
      });
    });
    describe('/comments', () => {
      it('deletes a comment for a given comment id', () => {
        return request.delete('/api/comments/1').expect(204);
      });
      it('PATCHES the votes of a comments to increase the votes', () => {
        return request
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.eql({
              comment_id: 1,
              article_id: 9,
              author: 'butter_bridge',
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 17,
              created_at: '2017-11-22T12:36:03.389Z'
            });
          });
      });
      it('PATCHES the votes of a article to reduce the votes', () => {
        return request
          .patch('/api/comments/1')
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.eql({
              comment_id: 1,
              article_id: 9,
              author: 'butter_bridge',
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 15,
              created_at: '2017-11-22T12:36:03.389Z'
            });
          });
      });
      describe('ERROR HANDLING', () => {
        describe('ERRORS-Route Methods', () => {
          it('returns error when incorrect method used', () => {
            const notMethods = ['get', 'put', 'post'];
            return Promise.all(
              notMethods.map(method => {
                return request[method]('/api/comments/1')
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal('Method Not Allowed');
                  });
              })
            );
          });
        });
        it('return an error when id to be deleted does not exist', () => {
          return request
            .delete('/api/comments/99999999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Comment id: '99999999' Not Found");
            });
        });
        it('return an error when id does to be deleted does not exist', () => {
          return request
            .delete('/api/comments/notACommentId')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`Error Code: 22P02`);
            });
        });
        it('returns and error when body is empty', () => {
          return request
            .patch('/api/comments/1')
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
            .patch('/api/comments/1')
            .send({ inc_votes: 'wrongType' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(`Error Code: 22P02`);
            });
        });
      });
    });
  });
});
