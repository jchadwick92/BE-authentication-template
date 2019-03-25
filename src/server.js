const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport')(passport);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/settings").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('You just hit the home page\n')
})

const auth = require('./users/controllers/authController');
app.use('/api/auth', auth);

// authenticate all routes
app.use(passport.authenticate('jwt', {session: false}))

const users = require('./users/controllers/usersController');
app.use('/api/users', users);

const adminUsers = require('./users/controllers/adminUsersController');
app.use('/api/admin/users', adminUsers);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;