/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const { logErrors, errorHandler } = require('./handlers/errors');
const db = require('./services/db');

// --- EXPRESS
const app = express();
const port = process.env.PORT || 3000;

// -- DB ELEMENTS
db.connect();

// -- BODY-PARSERS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());


// -- ROUTES
// ---- /movies
app.use('/movies', require('./routes/movies'));
app.use('/comments', require('./routes/comments'));

// -- ERROR HANDLERS USAGE
app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
