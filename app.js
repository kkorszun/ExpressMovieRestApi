/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const { mongoose } = db;

// --- my parsers
function parseTitle(reqBody) {
  if (reqBody.title && typeof reqBody.title === 'string') {
    const title = reqBody.title.trim().toLowerCase();
    if (title !== '') {
      return title;
    }
  }
  return undefined;
}

function parseObjectId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  return undefined;
}

function parseComment(reqBody) {
  let movieId;
  let text;

  if (reqBody.movieId && typeof reqBody.movieId === 'string') {
    movieId = parseObjectId(reqBody.movieId);
  }
  if (reqBody.text && typeof reqBody.text === 'string') {
    ({ text } = (reqBody));
  }
  return { movieId, text };
}

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
  if (err) {
    // res.sendStatus(500);
    next(err);
  } else {
    res.json(data);
  }
}));

app.post('/movies', (req, res, next) => {
  const title = parseTitle(req.body);
  if (title) {
    movieService.add(title, (err, data) => {
      if (err) { next(err); } else {
        res.json(data);
      }
    });
  } else {
    next(new Error('Value is not notempty String'));
  }
});

// /comments
app.get('/comments/:id', (req, res, next) => {
  const id = parseObjectId(req.params.id);
  if (id) {
    commentService.getByMovie(id, (err, data) => {
      if (err) {
        next(err);
      } else res.json(data);
    });
  } else {
    next(new Error('Value is not ObjectId'));
  }
});

app.get('/comments', (req, res, next) => {
  commentService.getAll((err, data) => {
    if (err) { next(err); } else res.json(data);
  });
});

app.post('/comments', (req, res, next) => {
  const { movieId, text } = parseComment(req.body);
  if (movieId && text) {
    // res.json(req.body);
    commentService.add(movieId, text, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(data);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening on port ${port}!`));
