const router = require('express').Router();
const commentController = require('../controllers/comment');
const {
  moveIdToBody,
  validateObjectId,
  validateText,
} = require('../middleware/myMiddleware');

router.get('/', (req, res, next) => {
  commentController.getAll((err, data) => {
    if (err) next(err); else res.json(data);
  });
});

router.post('/', validateObjectId('movieId'), validateText,
  ((req, res, next) => {
    commentController.add(req.body.movieId, req.body.text, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(data);
      }
    });
  }));

router.get('/:id', moveIdToBody, validateObjectId());
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
