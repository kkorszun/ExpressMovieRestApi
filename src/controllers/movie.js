const Movie = require('../models/movie');
const omdbapi = require('../services/omdbapi');

async function movieExist(movie) {
  return (await Movie.findOne({ movie: { title: movie.title } }).exec()) !== null;
}

async function saveMovie(movie) {
  if (await movieExist(movie)) {
    throw new Error('Movie already exists');
  } else {
    return Movie.create({ movie });
  }
}

const add = async (title, callback) => {
  try {
    const movie = await omdbapi.fetchFromApi(title);
    callback(null, await saveMovie(movie));
  } catch (err) {
    callback(err);
  }
};

function getAll(callback) {
  Movie.find(callback);
}

module.exports = { add, getAll, movieExist };
