const Movie = require('../models/movie');
const Comment = require('../models/comment');

function getByMovie(id, callback) {
  Comment.find({ Movie: id }, callback);
}

function getAll(callback) {
  Comment.find(callback);
}

function add(movieId, text, callback) {
  Movie.findById(movieId).exec()
    .then((result) => {
      if (result) {
        return Comment.create({ movieId, text });
      }
      return Promise.reject(new Error('No movie with this ObjectId'));
    })
    .then(comment => callback(null, comment))
    .catch(callback);
}

// eslint-disable-next-line func-names
module.exports = {
  getByMovie, getAll, add,
};
