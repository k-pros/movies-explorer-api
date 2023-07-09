require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./config');
const router = require('./routes');
const { handleErrors } = require('./middlewares/handleErrors');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');

const app = express();
mongoose.connect(DB_URL);
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(router);

app.use(handleErrors); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
