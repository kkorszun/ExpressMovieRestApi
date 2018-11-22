/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const errorHandlers = require('./errorHandlers');
const db = require('./db');

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
app.use(errorHandlers.logErrors);
app.use(errorHandlers.errorHandler);

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
