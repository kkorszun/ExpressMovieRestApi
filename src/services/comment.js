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
    .then(() => Comment.create({ movieId, text }))
    .then(comment => callback(null, comment))
    .catch(callback);
}

// eslint-disable-next-line func-names
module.exports = {
  getByMovie, getAll, add,
};
