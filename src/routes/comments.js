const router = require('express').Router();
const commentController = require('../controllers/comment');
const { formatObject } = require('../helpers/apiObjectFormatter');
const {
  validateObjectIdBody,
  validateObjectIdParam,
  validateText,
} = require('../middleware/myMiddleware');

router.get('/', (req, res, next) => {
  commentController.getAll((err, data) => {
    if (err) next(err); else res.json(data);
  });
});

router.post('/', validateObjectIdBody('movieId'), validateText,
  ((req, res, next) => {
    commentController.add(req.body.movieId, req.body.text, (err, data) => {
      if (err) {
        next(err);
      } else {
        res.json(formatObject(null, data, 200));
      }
    });
  }));

router.get('/:id', validateObjectIdParam);
router.get('/:id', (req, res, next) => {
  commentController.getByMovie(req.params.id, (err, data) => {
    if (err) {
      next(err);
    } else {
      res.json(formatObject(null, data, 200));
    }
  });
});

module.exports = router;
