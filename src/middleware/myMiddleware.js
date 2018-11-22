const mongoose = require('mongoose');
const { parseTitle } = require('../helpers/parsers');

function validateTitle(req, res, next) {
  let err;
  if (req.body.title) {
    [err, req.body.title] = parseTitle(req.body.title);
  } else {
    res.statusCode = 400;
    next(new Error('No title value'));
  }
  if (err) {
    res.statusCode = 400;
    next(err);
  }
  next();
}

function moveIdToBody(req, res, next) {
  req.body.id = req.params.id;
  next();
}

function validateObjectId(name = 'id') {
  const { ObjectId } = mongoose.Types;
  return (req, res, next) => {
    const id = req.body[name];
    if (!id || (typeof id !== 'string') || !ObjectId.isValid(id)) {
      res.statusCode = 400;
      next(new Error(`Argument ${id} is not valid ObjectId`));
    }
    next();
  };
}

function validateText(req, res, next) {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    next(new Error('Comment is not notempty string'));
  }
  next();
}

function usePlainAsTitle(req, res, next) {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
}

module.exports = {
  validateTitle,
  validateObjectId,
  validateText,
  moveIdToBody,
  usePlainAsTitle,
};
