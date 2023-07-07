const User = require('../models/user');
const {
  IncorrectError,
  NotFoundError,
} = require('../errors');

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
