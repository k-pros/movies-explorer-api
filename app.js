const express = require('express');
const mongoose = require('mongoose');

const { PORT, DB_URL } = require('./config');

const app = express();
mongoose.connect(DB_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
