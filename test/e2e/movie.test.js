/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');

const app = require('../../src/app');
const Movie = require('../../src/models/movie');
const Comment = require('../../src/models/comment');
const mockMovie = require('./../mockMovie');

let myMovie;

describe('E2E: /movies', () => {
  const agent = request.agent(app);

  before(async () => {
    await mongoose.connection;
    await Movie.deleteMany().exec();
    myMovie = new Movie({ movie: mockMovie });
    await myMovie.save();
  });

  after(async () => {
    await Movie.deleteMany().exec();
    await Comment.deleteMany().exec();
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

  // mock here
  describe('POST /movies', () => {
    it('movie.Title should be "Hair"', (done) => {
      request(app)
        .post('/movies')
        .send({ title: 'hair' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          assert(res.body.data.movie.Title, 'Hair');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('POST /movies', () => {
    it('bad request returns 400', (done) => {
      request(app)
        .post('/movies')
        .send({})
        .expect(400, done);
    });
  });
});
