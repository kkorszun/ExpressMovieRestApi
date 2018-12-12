const Movie = require('../models/movie');
const omdbapi = require('../services/omdbapi');

async function movieExist(title) {
  if (typeof title !== 'string') throw new Error('TypeError: title is not string');
  const result = await Movie.findOne({ 'movie.Title': title }).exec();
  return (result !== null);
}

async function saveMovie(movie) {
  if (await movieExist(movie.Title)) {
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
