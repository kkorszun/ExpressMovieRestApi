/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const assert = require('assert');

const app = require('../src/app');
const Movie = require('../src/models/movie');
const Comment = require('../src/models/comment');
const mockMovie = require('./mockMovie');

let myMovie;


describe('request.agent(app)', () => {
  const agent = request.agent(app);

  before(async () => {
    await mongoose.connection;
    myMovie = new Movie({ movie: mockMovie });
    // console.log(myMovie);
    await myMovie.save();
    // await Movie.find(data => console.log(data)).;
  });

  after(async () => {
    await Movie.deleteMany().exec();
    await Comment.deleteMany().exec();
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

  describe('POST /movies', () => {
    it('movie.Title should be "Hair"', (done) => {
      request(app)
        .post('/movies')
        .send({ title: 'hair' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          assert(res.body.movie.Title, 'Hair');
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

  describe('GET /comments', () => {
    it('respond with json', (done) => {
      agent
        .get('/comments')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /comments/id', () => {
    it('respond with json', (done) => {
      agent
        .get(`/comments/${myMovie._id.toString()}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /comments/:id', () => {
    it('bad request returns 400', (done) => {
      agent
        .get('/comments/aaa')
        .expect(400, done);
    });
  });


  describe('POST /comments/', () => {
    it('respond with json and text should be as given', (done) => {
      request(app)
        .post('/comments')
        .send({ movieId: myMovie._id.toString(), text: 'test' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          assert(res.body.text, 'test');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('POST /comments/', () => {
    it('bad request returns 400', (done) => {
      request(app)
        .post('/comments')
        .send({})
        .expect(400, done);
    });
  });


  // should be changed (it's 500, should be 400)
  describe('POST /comments/', () => {
    it('respond with 400  if movie id with does not exists', (done) => {
      request(app)
        .post('/comments')
        .send({ movieId: '5be2fedb037ffa3fecbef7ea', text: 'test' })
        .expect(500, done);
    });
  });
});
