const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./config');
const router = require('./routes');
const { handleErrors } = require('./middlewares/handleErrors');

const app = express();
mongoose.connect(DB_URL);
app.use(express.json());

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '64a85baebb67dcc00c7e0099',
  };

  next();
});

app.use(router);

app.use(handleErrors); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
