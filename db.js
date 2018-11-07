/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

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
  mongoose.connect(monogoAddress, { bufferCommands: false }).then(
    () => { callback(null); },
    (err) => { callback(err); },
  );
}

const dbCb = (err) => {
  if (err) {
    console.error(err.stack);
    mongoose.disconnect();
  }
};

mongoose.connection.on('connected', () => {
  console.log('INFO: Db Connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('INFO: Db disconnected');
  setTimeout(() => {
    dbConnect(dbCb);
  }, 60000);
});

mongoose.connection.on('error', () => { mongoose.disconnect(); });

function connect() { dbConnect(dbCb); }

module.exports = { mongoose, connect };
