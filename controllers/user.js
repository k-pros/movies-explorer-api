const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  IncorrectError,
  NotFoundError,
  Conflict,
} = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с указанным _id не найден.'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const noPasswordUser = user.toObject({ useProjection: true });
      res.send(noPasswordUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new IncorrectError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};
