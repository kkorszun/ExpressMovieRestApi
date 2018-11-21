/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const myParsers = require('./myParsers');
const errorHandlers = require('./errorHandlers');
const db = require('./db');

// --- EXPRESS
const app = express();
const port = process.env.PORT || 3000;

// -- DB ELEMENTS
db.connect();
const movieController = require('./controllers/movie');
const commentController = require('./controllers/comment');

// -- BODY-PARSERS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());


// -- ROUTES
// ---- /movies
app.get('/movies', (req, res, next) => movieController.getAll((err, data) => {
  if (err) { next(err); } else res.json(data);
}));

app.post('/movies', (req, res, next) => {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
});
app.post('/movies', myParsers.parseTitle);
app.post('/movies', (req, res, next) => {
  movieController.add(req.body.title, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

// ---- /comments
app.get('/comments', (req, res, next) => {
  commentController.getAll((err, data) => {
    if (err) next(err); else res.json(data);
  });
});

app.post('/comments', myParsers.parseObjectId('movieId'));
app.post('/comments', myParsers.parseText);
app.post('/comments', (req, res, next) => {
  commentController.add(req.body.movieId, req.body.text, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

app.get('/comments/:id', myParsers.parseGetId);
app.get('/comments/:id', myParsers.parseObjectId());
app.get('/comments/:id', (req, res, next) => {
  commentController.getByMovie(req.body.id, (err, data) => {
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
