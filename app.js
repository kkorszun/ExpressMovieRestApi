/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const myParsers = require('./myParsers');
require('dotenv').config();
const db = require('./db');

const { mongoose } = db;
// .isValid(id)
// --- error handlers
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.sendStatus(500);
  } else {
    next(err);
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  if (res.statusCode === 400) {
    res.sendStatus(400);
  }
  res.sendStatus(500);
}
// ---

const app = express();
const port = process.env.PORT || 3000;

// --- DB elemeents
db.connect();
const Movie = mongoose.model('Movie', { movie: Object });
const Comment = mongoose.model('Comment', { movieId: String, text: String });
const movieService = require('./services/movie')(Movie);
const commentService = require('./services/comment')(Comment, Movie);
// ---

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use((req, res, next) => {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
});

// /movies
app.get('/movies', (req, res, next) => movieService.getAll((err, data) => {
  if (err) { next(err); } else res.json(data);
}));

app.post('/movies', myParsers.parseTitle);
app.post('/movies', (req, res, next) => {
  movieService.add(req.body.title, (err, data) => {
    if (err) next(err); else res.json(data);
  });
});

// /comments
app.get('/comments/:id', myParsers.parseObjectId(mongoose.Types.ObjectId));
app.get('/comments/:id', (req, res, next) => {
  commentService.getByMovie(req.body.id, (err, data) => {
    if (err) {
      next(err);
    } else res.json(data);
  });
});

app.get('/comments', (req, res, next) => {
  commentService.getAll((err, data) => {
    if (err) next(err); else res.json(data);
  });
});

app.post('/comments', myParsers.parseObjectId(mongoose.Types.ObjectId, 'movieId'));
app.post('/comments', myParsers.parseText);
app.post('/comments', (req, res, next) => {
  commentService.add(req.body.movieId, req.body.text, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening on port ${port}!`));
