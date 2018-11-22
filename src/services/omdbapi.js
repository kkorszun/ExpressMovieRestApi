const axios = require('axios');

async function fetchFromApi(title) {
  const t = title.trim().split(' ').filter(x => x !== '').join('+');
  const myUrl = 'http://www.omdbapi.com/';
  const params = { apikey: process.env.API_KEY, t };
  const movie = (await axios.get(myUrl, { params })).data;
  if (movie.Response && movie.Response === 'False') {
    throw new Error(movie.Error);
  }
  return movie;
}

module.exports = { fetchFromApi };
