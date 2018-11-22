const router = require('express').Router();
const movieController = require('../controllers/movie');
const myParsers = require('../myParsers');

// middleware that is specific to this router
router.get('/', (req, res, next) => movieController.getAll((err, data) => {
  if (err) { next(err); } else res.json(data);
}));

router.post('/', (req, res, next) => {
  if (req.body && req.headers['content-type'] === 'text/plain') {
    req.body = { title: req.body };
  }
  next();
});
router.post('/', myParsers.parseTitle);
router.post('/', (req, res, next) => {
  movieController.add(req.body.title, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
