/* eslint-disable no-console */
// -- VALIDATORS
function validateTitle(title) {
  if (typeof title === 'string') {
    const result = title.trim().toLowerCase();
    if (result !== '') {
      return [null, result];
    }
  }
  return [new Error('Title value is not proper')];
}

// -- PARSERS
function parseTitle(req, res, next) {
  let err;
  if (req.body.title) {
    [err, req.body.title] = validateTitle(req.body.title);
    console.log(req.body.title);
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

function parseObjectId(ObjectId, name) {
  return (req, res, next) => {
    const id = req.body[name || 'id'];
    if (!id || (typeof id !== 'string') || !ObjectId.isValid(id)) {
      res.statusCode = 400;
      next(new Error(`Argument ${id} is not valid ObjectId`));
    }
    next();
  };
}

function parseText(req, res, next) {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    next(new Error('Comment is not notempty string'));
  }
  next();
}

module.exports = { parseTitle, parseObjectId, parseText };
