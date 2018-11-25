function formatObject(err, data, status) {
  const resultObject = { };
  resultObject.status = status;
  if (err) {
    resultObject.errors = [err.message];
  }
  if (data) resultObject.data = data;
  return resultObject;
}

module.exports = { formatObject };
