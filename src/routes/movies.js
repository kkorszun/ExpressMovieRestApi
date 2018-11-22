const router = require('express').Router();
const movieController = require('../controllers/movie');
const { validateTitle, usePlainAsTitle } = require('../middleware/myMiddleware');

router.get('/', (req, res, next) => movieController.getAll((err, data) => {
  if (err) { next(err); } else res.json(data);
}));

router.post('/', usePlainAsTitle); // plain text move to req.body.title
router.post('/', validateTitle);
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
