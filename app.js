/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const myHttpPromise = require('./myHttpPromise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

function parseTitle(reqBody) {
  if (reqBody.title && typeof reqBody.title === 'string') {
    const title = reqBody.title.trim().toLowerCase();
    if (title !== '') {
      return title;
    }
  }
  return undefined;
}

function buildDbAddress() {
  if (process.env.DEFAULT_DB
    && (process.env.DEFAULT_DB.toLowerCase() === 'false')
    && process.env.DB_HOST
    && process.env.DB_NAME
    && process.env.DB_USER
    && process.env.DB_PASS) {
    return `mongodb://${process.env.DB_HOST}`
      .replace('<dbuser>', process.env.DB_USER)
      .replace('<dbpassword>', process.env.DB_PASS)
      .replace('<dbname>', process.env.DB_NAME);
  }
  return undefined;
}

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function dbConnect(callback) {
  const monogoAddress = buildDbAddress() || 'mongodb://localhost/moviesDb';
  mongoose.connect(monogoAddress, { useNewUrlParser: true }).then(
    () => { callback(null); },
    (err) => { callback(err); },
  );
}

const dbCb = (err) => {
  if (err) {
    console.error(err.stack);
    mongoose.disconnect();
  } else {
    console.log('INFO: Db Connected');
  }
};

dbConnect(dbCb);

mongoose.connection.on('disconnected', () => {
  console.log('INFO: Db disconnected');
  setTimeout(() => {
    dbConnect(dbCb);
  }, 10000);
});


mongoose.set('bufferCommands', false);

const Movie = mongoose.model('Movie', { movie: Object });
const Comment = mongoose.model('Comment', { movie_id: String, text: String });


function getComments(id, callback) {
  Comment.find({ Movie: id }, callback);
}

function getAllComments(callback) {
  Comment.find(callback);
}

function addMovie(title, callback) {
  const newTitle = title.trim().split(' ').filter(x => x !== '').join('+');
  const myUrl = `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${newTitle}`;
  let movie;
  myHttpPromise(myUrl)
    .then((data) => {
      movie = JSON.parse(data.toString());
      if (movie.Response && movie.Response === 'False') {
        return Promise.reject(new Error(movie.Error));
      }
      return Movie.findOne({ movie }).exec();
    })
    .then((movie2) => {
      if (!movie2) {
        return Movie.create({ movie });
      }
      return Promise.reject(new Error('Movie already exist'));
    })
    .then(result => callback(null, result))
    .catch(error => callback(error));
}

function addComment(movie_id, text, callback) {
  Movie.findById(movie_id).exec()
    .then(() => Comment.create({ movie_id, text }))
    .then(comment => callback(null, comment))
    .catch(callback);
}

function getAllMovies(callback) {
  Movie.find(callback);
}

/* function getMovie(id, callback) {
  Movie.findById(id, callback);
} */

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use((req, res, next) => {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
});

app.get('/movies', (req, res, next) => getAllMovies((err, data) => {
  if (err) {
    // res.sendStatus(500);
    next(err);
  } else {
    res.json(data);
  }
}));

function parseObjectId(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  return undefined;
}

app.get('/comments/:id', (req, res, next) => {
  const id = parseObjectId(req.params.id);
  if (id) {
    getComments(id, (err, data) => {
      if (err) {
        next(err);
      } else res.json(data);
    });
  } else {
    next(new Error('Value is not ObjectId'));
  }
});

app.get('/comments', (req, res, next) => {
  getAllComments((err, data) => {
    if (err) { next(err); } else res.json(data);
  });
});



app.post('/movies', (req, res, next) => {
  const title = parseTitle(req.body);
  if (title) {
    addMovie(title, (err, data) => {
      if (err) { next(err); } else {
        res.json(data);
      }
    });
  } else {
    next(new Error('Value is not notempty String'));
  }
});

function parseComment(reqBody) {
  let movie_id;
  let text;
  if (reqBody.movie_id && typeof reqBody.movie_id === 'string') {
    movie_id = parseObjectId(reqBody.movie_id);
  }
  if (reqBody.text && typeof reqBody.text === 'string') {
    text = parseObjectId(reqBody.movie_id);
  }
  return { movie_id, text };
}

app.post('/comments', (req, res, next) => {
  const { movie_id, text } = parseComment(req.body);
  if (movie_id && text) {
    // res.json(req.body);
    addComment(movie_id, text, (err, data) => {
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
