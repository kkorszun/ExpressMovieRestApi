/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const myParsers = require('./myParsers');
const errorHandlers = require('./errorHandlers');
require('dotenv').config();
const db = require('./db');

// --- EXPRESS
const app = express();
const port = process.env.PORT || 3000;

// -- DB ELEMENTS
db.connect();
const movieService = require('./services/movie');
const commentService = require('./services/comment');

// -- BODY-PARSERS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());


// -- ROUTES
// ---- /movies
app.get('/movies', (req, res, next) => movieService.getAll((err, data) => {
  if (err) { next(err); } else res.json(data);
}));

app.post((req, res, next) => {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
});
app.post('/movies', myParsers.parseTitle);
app.post('/movies', (req, res, next) => {
  movieService.add(req.body.title, (err, data) => {
    if (err) next(err); else res.json(data);
  });
});

// ---- /comments
app.get('/comments/:id', myParsers.parseGetId);
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

// -- ERROR HANDLERS USAGE
app.use(errorHandlers.logErrors);
app.use(errorHandlers.errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
