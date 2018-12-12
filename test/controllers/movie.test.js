/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const assert = require('assert');
const mongoose = require('mongoose');
const Movie = require('../../src/models/movie');
const movieController = require('../../src/controllers/movie');
const db = require('../../src/services/db');

const mockMovie = require('./../mockMovie');
const mockMovie2 = require('./../mockMovie2');

let myMovie;
let inputLen = 0;

describe('controller/movie', () => {
  before(async () => {
    db.connect();
    await mongoose.connection;
    await Movie.deleteMany().exec();
    myMovie = new Movie({ movie: mockMovie });
    await myMovie.save();
    inputLen = 1;
  });

  after(async () => {
    await Movie.deleteMany().exec();
  });

  // add
  describe('#add', () => {
    // it should return saved movie
    it('should return saved movie', (done) => {
      // make mock API with this title
      const mockTitle = 'dog';
      movieController.add(mockTitle, (err, data) => {
        if (err) done(err);
        else if (data._id && data.movie && data.movie.Title) {
          inputLen += 1;
          done();
        } else {
          done(new Error('Uncomplete or bad format of data'));
        }
      });
    });
    // it should return error if movie exists
    it('should return saved movie', (done) => {
      movieController.add(myMovie.title, (err) => {
        if (err) done();
        else done(new Error('Unexpected error'));
      });
    });
    it('should return error if data is not valid', (done) => {
      movieController.add(null, (err) => {
        if (err) done();
        else done(new Error('Unexpected error'));
      });
    });
  });

  // getAll
  describe('#getAll', () => {
    // it should return array of length n
    it('should return array of length: $inputLen', (done) => {
      movieController.getAll((err, data) => {
        if (err) done(err);
        else {
          assert.equal(data.length, inputLen);
          done();
        }
      });
    });
    // REST mock will work here too : at least 3 mocked elements
    // it should return array of length n+1 after adding element
    it('should ', (done) => {
      myMovie = new Movie({ movie: mockMovie2 });
      myMovie
        .save()
        .then(() => {
          movieController.getAll((err, data) => {
            if (err) done(err);
            else {
              assert.equal(data.length, inputLen + 1);
              done();
            }
          });
        });
    });
  });

  // movieExist
  describe('#movieExist', () => {
    // it should return true for existing movie
    it('should return true for existing movie', async () => {
      const result = await movieController.movieExist(myMovie.movie.Title);
      assert.equal(result, true);
    });
    // it should return false for not existing
    it('should return false for not existing', async () => {
      const result = await movieController.movieExist('Abcd');
      assert.equal(result, false);
    });
    // it should return error for bad data
    it('should return error for bad data', async () => {
      assert.rejects(movieController.movieExist(null));
    });
  });
});
