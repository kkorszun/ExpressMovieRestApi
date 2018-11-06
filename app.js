const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const bl = require('bl');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const monogoAddress = 'mongodb://localhost/moviesDb';


mongoose.connect(monogoAddress);
const Movie = mongoose.model('Movie', { Title: String, Year: String });
const Comment = mongoose.model('Comment', { Movie: String, Text: String });


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
    // eslint-disable-next-line consistent-return
    response.pipe(bl((err, data) => {
      if (err) {
        callback(err);
      } else {
        const movieObj = JSON.parse(data.toString());
        Movie.create(movieObj, callback);
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
