/* eslint-disable no-underscore-dangle */
const Movie = require('../models/movie');
const Comment = require('../models/comment');

function getByMovie(id, callback) {
  Comment.find({ Movie: id }, callback);
}

function getAll(callback) {
  Comment.find(callback);
}

const add = async (movieId, text, callback) => {
  try {
    const movie = await Movie.findById(movieId).exec();
    if (movie) {
      const comment = await Comment.create({ movieId: movie._id, text });
      if (comment) {
        callback(null, comment);
      }
    } else {
      throw new Error('No movie with this ObjectId');
    }
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  getByMovie, getAll, add,
};
