const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT, DB_URL } = require('./config');

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
