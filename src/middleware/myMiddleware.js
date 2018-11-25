const { parseTitle, parseObjectId } = require('../helpers/parsers');

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

function validateObjectIdParam(req, res, next) {
  parseObjectId(req.params.id, (err) => {
    if (err) {
      res.statusCode = 404;
      next(err);
    } else {
      next();
    }
  });
}

function validateObjectIdBody(name = 'id') {
  return (req, res, next) => {
    const id = req.body[name];
    parseObjectId(id, (err) => {
      if (err) {
        res.statusCode = 400;
        next(err);
      }
      next();
    });
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
  validateObjectIdBody,
  validateText,
  validateObjectIdParam,
  usePlainAsTitle,
};
