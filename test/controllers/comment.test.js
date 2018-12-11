/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const assert = require('assert');
const mongoose = require('mongoose');
const Movie = require('../../src/models/movie');
const Comment = require('../../src/models/comment');
const commentController = require('../../src/controllers/comment');
const db = require('../../src/services/db');

// const mockMovie = require('./mockMovie');

// let myMovie;

describe('controller/comment', () => {
  before(async () => {
    db.connect();
    await mongoose.connection;
    await Movie.deleteMany().exec();
    await Comment.deleteMany().exec();
  });

  after(async () => {
    await Movie.deleteMany().exec();
    await Comment.deleteMany().exec();
  });

  describe('#add', () => {
    it('should return error if movie with given id does not exist', function (done) {
      commentController.add('111', 'hey', (err) => {
        if (err) done();
        else done(new Error("Don't expected error"));
      });
    });
  });

  // getByMovie
  describe('#getByMovie', () => {
    it('should true === true', () => {
      assert(true, true);
    });
  });

  // getAll
  describe('#getAll', () => {
    it('should true === true', () => {
      assert(true, true);
    });
  });
});
