const router = require('express').Router();
const commentController = require('../controllers/comment');
const myParsers = require('../myParsers');

router.get('/', (req, res, next) => {
  commentController.getAll((err, data) => {
    if (err) next(err); else res.json(data);
  });
});

router.post('/', myParsers.parseObjectId('movieId'), myParsers.parseText,
  ((req, res, next) => {
    commentController.add(req.body.movieId, req.body.text, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(data);
      }
    });
  }));

router.get('/:id', myParsers.parseGetId, myParsers.parseObjectId());
router.get('/:id', (req, res, next) => {
  commentController.getByMovie(req.body.id, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(data);
    }
  });
});

module.exports = router;
