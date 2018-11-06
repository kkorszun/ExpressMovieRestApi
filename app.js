/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const bl = require('bl');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

function dbConnect(callback) {
  const monogoAddress = buildDbAddress() || 'mongodb://localhost/moviesDb';
  mongoose.connect(monogoAddress, { useNewUrlParser: true }).then(
    () => { callback(null); },
    (err) => { callback(err); },
  );
}

const dbCb = (err) => {
  if (err) {
    console.error(err);
    setTimeout(() => {
      dbConnect(dbCb);
    }, 50000);
  } else {
    console.log('INFO: Db Connected');
  }
};

dbConnect(dbCb);

mongoose.connection.on('disconnected', () => {
  console.log('INFO: Db disconnected');
  dbConnect(dbCb);
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
  http.get(myUrl, (response) => {
    response.pipe(bl((err, data) => {
      if (err) {
        callback(err);
      } else {
        const movie = JSON.parse(data.toString());
        Movie.create({ movie }, callback);
      }
    }));
  });
}


function addComment(movie, text, callback) {
  Comment.create({ Movie: movie, Text: text }, callback);
}

function getAllMovies(callback) {
  Movie.find(callback);
}

/* function getMovie(id, callback) {
  Movie.findById(id, callback);
} */

app.use(bodyParser.json());

app.get('/movies', (req, res) => getAllMovies((err, data) => {
  if (err) {
    res.sendStatus(500);
  } else {
    res.json(data);
  }
}));

app.get('/comments/:id', (req, res) => {
  getComments(req.params.id, (err, data) => {
    if (err) {
      // ...
    } else res.json(data);
  });
});

app.get('/comments', (req, res) => {
  getAllComments((err, data) => {
    if (err) { /* ... */ } else res.json(data);
  });
});

app.post('/movies', (req, res) => {
  if (req.body.title) {
    addMovie(req.body.title, (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(data);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.post('/comments', (req, res) => {
  if (req.body.id && req.body.comment) {
    // res.json(req.body);
    addComment(req.body.id, req.body.comment, (err, data) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.json(data);
      }
    });
  } else {
    res.sendStatus(400);
  }
});


// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening on port ${port}!`));
