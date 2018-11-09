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
    await Movie.remove().exec();
    await Comment.remove().exec();
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

  describe('GET /comments/:id', () => {
    it('respond with json', (done) => {
      agent
        .get(`/comments/${myMovie._id.toString()}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
