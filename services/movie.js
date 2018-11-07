const myHttpPromise = require('../myHttpPromise');

function add(title, callback) {
  const newTitle = title.trim().split(' ').filter(x => x !== '').join('+');
  const myUrl = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${newTitle}`;
  let movie;
  myHttpPromise(myUrl)
    .then((data) => {
      movie = JSON.parse(data.toString());
      if (movie.Response && movie.Response === 'False') {
        return Promise.reject(new Error(movie.Error));
      }
      return this.Movie.findOne({ movie }).exec();
    })
    .then((movie2) => {
      if (!movie2) {
        return this.Movie.create({ movie });
      }
      return Promise.reject(new Error('Movie already exist'));
    })
    .then(result => callback(null, result))
    .catch(error => callback(error));
}

function getAll(callback) {
  this.Movie.find(callback);
}

/* function getMovie(id, callback) {
  Movie.findById(id, callback);
} */

// eslint-disable-next-line func-names
module.exports = function (Movie) {
  return { Movie, add, getAll };
};
