const axios = require('axios');
const Movie = require('../models/movie');

const add = async (title, callback) => {
  const t = title.trim().split(' ').filter(x => x !== '').join('+');
  const myUrl = 'http://www.omdbapi.com/';
  const params = { apikey: process.env.API_KEY, t };
  try {
    const movie = (await axios.get(myUrl, { params })).data;
    if (movie.Response && movie.Response === 'False') {
      throw new Error(movie.Error);
    }
    const movie2 = await Movie.findOne({ movie }).exec();
    if (!movie2) {
      callback(null, await Movie.create({ movie }));
    } else {
      throw new Error('Movie already exists');
    }
  } catch (err) {
    callback(err);
  }
};

function getAll(callback) {
  Movie.find(callback);
}

module.exports = { add, getAll };
