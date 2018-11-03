const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const mockDb = [];

const mockIdGen = (function () {
  let counter = 0;
  return function () {
    counter += 1;
    return counter;
  };
}());

function getComments(id, callback) {
  callback(null, []);
}

function getAllComments(callback) {
  callback(null, []);
}

function addMovie(title, callback) {
  const movieObj = { id: mockIdGen(), movie: { title } };
  mockDb.push(movieObj);
  callback(null, movieObj);
}

function getAllMovies(callback) {
  callback(null, mockDb);
}

/* function getMovie(id, callback) {
  const result = mockDb.filter(x => x.id === id);
  callback(null, result);
} */

app.use(bodyParser.json());

app.get('/movies', (req, res) => getAllMovies((err, data) => {
  if (err) {
    res.sendStatus(500);
  } else {
    res.json(data);
  }
}));

app.get('/comments/:id(\\d+)', (req, res) => {
  getComments(req.body.title, (err, data) => {
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
    res.json(req.body);
  } else {
    res.sendStatus(400);
  }
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
