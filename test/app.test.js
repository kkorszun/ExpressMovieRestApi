const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('request.agent(app)', () => {
  const agent = request.agent(app);

  before(async () => {
    await db.mongoose.connection;
  });

  describe('GET /', () => {
    it('respond with 404 status', (done) => {
      agent
        .get('/')
        .expect(404, done);
    });
  });

  describe('GET /movies', () => {
    it('respond with json', (done) => {
      agent
        .get('/movies')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /comments', () => {
    it('respond with json', (done) => {
      agent
        .get('/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
