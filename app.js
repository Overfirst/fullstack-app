const express = require('express')
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const keys = require('./config/keys');
const app = express();

mongoose.connect(keys.mongoURI, keys.mongoOptions)
    .then(() => console.log('MongoDB successfully connected'))
    .catch((error) => console.error('MongoDB error: ', error));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use(require('cors')());

app.use('/uploads', express.static('uploads'));

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/category', require('./routes/category'));
app.use('/api/order', require('./routes/order'));
app.use('/api/position', require('./routes/position'));

module.exports = app;
