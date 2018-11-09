function getByMovie(id, callback) {
  this.Comment.find({ Movie: id }, callback);
}

function getAll(callback) {
  this.Comment.find(callback);
}

function add(movieId, text, callback) {
  this.Movie.findById(movieId).exec()
    .then(() => this.Comment.create({ movieId, text }))
    .then(comment => callback(null, comment))
    .catch(callback);
}

// eslint-disable-next-line func-names
module.exports = function (Comment, Movie) {
  return {
    Comment, Movie, getByMovie, getAll, add,
  };
};
