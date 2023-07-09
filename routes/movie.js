const router = require('express').Router();
const { getMovie, addMovie, deleteMovie } = require('../controllers/movie');
const { validateAddMovie, validateMovieId } = require('../middlewares/validation');

router.get('/', getMovie);
router.post('/', validateAddMovie, addMovie);
router.post('/_id', validateMovieId, deleteMovie);

module.exports = router;
