require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { handleErrors } = require('./middlewares/handleErrors');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');
const { validateCreateUser, validateLogin } = require('./middlewares/validation');
const { PORT, DB_URL, LIMITER_OPTIONS } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit(LIMITER_OPTIONS); // настройка лимитера запросов

const app = express();
mongoose.connect(DB_URL);
app.use(express.json());
app.use(limiter);

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);
app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(handleErrors); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
