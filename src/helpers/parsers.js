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

module.exports = { parseTitle };
