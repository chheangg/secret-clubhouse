// Required Modules
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// convention in this project is using ES6's async rather than async module
require('express-async-errors');

// Routes
const indexRouter = require('./routes/indexRouter')
const userRouter = require('./routes/userRouter')
const usersRouter = require('./routes/usersRouter')
const messageRouter = require('./routes/messageRouter')

// Model
const User = require('./models/user')

// Utilities
const config = require('./utility/config');

// MongoDB Config
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, "MongoDB connection error:"))

// Main express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication config
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username })
      if (!user) {
        return done(null, false, { message: "Username not found" })
      }
      const passwordCheck = await bcrypt.compare(password, user.password)
      if (!passwordCheck) {
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user)
    } catch (err) {
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async(id, done) => {
  const user = await User.findById(id, { password: 0 })
  done(null, user)
})

// Authentication
app.use(session({ secret: config.SECRET, resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// Get user session if any
app.use((req, res, next) => {
  if (req.user) {
    req.user.full_name = `${req.user.family_name} ${req.user.given_name}`
    res.locals.currentUser = req.user
  }
  next()
})

// Routes middleware
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/user', userRouter)
app.use('/message', messageRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
