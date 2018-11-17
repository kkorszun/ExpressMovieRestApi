module.exports = require('mongoose')
  .model('Comment', { movieId: String, text: String });
