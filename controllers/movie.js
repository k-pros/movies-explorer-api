/* eslint-disable max-len */
const Movie = require('../models/movie');
const {
  IncorrectError,
  NotFoundError,
} = require('../errors');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .populate('owner') // замена id объектом c данными пользователя
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .populate('owner')
        .then((newMovie) => res.status(201).send(newMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при добавлении фильма'));
      }
      return next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найдена');
      }
      if (String(req.user._id) !== String(movie.owner)) {
        throw new NotFoundError('Запрещено удалять фильм, сохраненный другим пользователем');
      }
      return movie.deleteOne()
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectError('Передан несуществующий _id фильма'));
      }
      return next(err);
    });
};
