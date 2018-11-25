const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types.ObjectId;
// Parsers
function parseTitle(title) {
  if (typeof title === 'string') {
    const result = title.trim().toLowerCase();
    if (result !== '') {
      return [null, result];
    }
  }
  return [new Error('Title value is not proper')];
}

function parseObjectId(id, callback) {
  if (!id || (typeof id !== 'string') || !ObjectId.isValid(id)) {
    callback(new Error(`Argument ${id} is not valid ObjectId`));
  } else {
    callback();
  }
}

module.exports = { parseTitle, parseObjectId };
