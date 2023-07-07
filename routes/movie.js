const router = require('express').Router();
const { getMovie, addMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovie);
router.post('/', addMovie);
router.post('/_id', deleteMovie);

module.exports = router;
