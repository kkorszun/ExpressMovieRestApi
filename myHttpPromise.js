const http = require('http');
const bl = require('bl');

function myHttpPromise(url) {
  const promise = new Promise((resolve, reject) => {
    http.get(url, (response) => {
      response.pipe(bl((err, data) => {
        resolve(data);
        reject(err);
      }));
    });
  });
  return promise;
}

module.exports = myHttpPromise;
