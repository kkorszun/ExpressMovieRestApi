const myHttpPromise = require('../myHttpPromise');
const Movie = require('../models/movie');

const add = async (title, callback) => {
  const newTitle = title.trim().split(' ').filter(x => x !== '').join('+');
  const myUrl = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${newTitle}`;
  try {
    const data = await myHttpPromise(myUrl);
    const movie = JSON.parse(data.toString());
    if (movie.Response && movie.Response === 'False') {
      throw new Error(movie.Error);
    }
    const movie2 = await Movie.findOne({ movie }).exec();
    if (!movie2) {
      callback(null, await Movie.create({ movie }));
    } else {
      throw new Error('Movie already exist');
    }
  } catch (err) {
    callback(err);
  }
};

function getAll(callback) {
  Movie.find(callback);
}

module.exports = { add, getAll };
