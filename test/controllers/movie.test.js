/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const assert = require('assert');
const mongoose = require('mongoose');
const Movie = require('../../src/models/movie');
const movieController = require('../../src/controllers/movie');
const db = require('../../src/services/db');

const mockMovie = require('./../mockMovie');

let myMovie;

describe('controller/movie', () => {
  before(async () => {
    db.connect();
    await mongoose.connection;
    await Movie.deleteMany().exec();
    myMovie = new Movie({ movie: mockMovie });
    await myMovie.save();
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
    it('should true === true', () => {
      assert(true, true);
    });
  });

  // movieExist
  describe('#movieExist', () => {
    it('should true === true', () => {
      assert(true, true);
    });
  });
});
