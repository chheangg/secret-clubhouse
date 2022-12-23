const bcrypt = require('bcrypt')
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const config = require('../utility/config')
const passport = require('passport')

// Display a list of all users
exports.user_list = (req, res) => {
  res.send('ROUTE: GET USERS')
}

// Display a form for creating user, or signing them up.
exports.user_create_get = (req, res) => {
  res.render('user_form', {
    title: 'Sign up user',
    buttonText: 'Sign-up'
  })
}

// Handle the creation of a user
exports.user_create_post = [
  body('family_name')
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body('given_name')
    .trim()
    .escape()
    .not()
    .isEmpty(),
  body('username')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Must be email')
    .normalizeEmail(),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Must be atleast 8 characters long'),
  body('confirm_password')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Must be atleast 8 characters long')
    .custom((value, {req}) => value === req.body.password)
    .withMessage('Password must match'),
  async (req, res, next) => {
    const errors = validationResult(req)
    const body = req.body

    // Check validation errors
    if (!errors.isEmpty()) {
      res.render('user_form', {
        title: 'Sign up user',
        buttonText: 'Sign-up',
        user: body,
        errors: errors.array()
      })
      return
    }

    // Check if user already exists
    const userExist = await User.findOne({ username: body.username })
    if (userExist) {
      res.render('user_form', {
        title: 'Sign up user',
        buttonText: 'Sign-up',
        user: body,
        errors: [{ msg: 'Username is already taken' }]
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      given_name: body.given_name,
      family_name: body.family_name,
      username: body.username,
      password: passwordHash,
      isMember: false
    })
    await user.save()
    res.redirect('/') 
  }
]

// Display a page to change and check user's membership.
// They can become a member by entering a secret code.
exports.user_membership_get = async (req, res) => {
  res.render('user_membership_form')
}

// Handle the changing of a user's membership
exports.user_membership_post = [
  body('secret_passcode')
    .trim()
    .escape(),
  body('userId')
  .trim()
  .escape(),
  async (req, res) => {
    const { userId, secret_passcode } = req.body
    const user = await User.findById(userId, { password: 0 })
    console.log(config.SECRET_PASSCODE)
    if (secret_passcode === config.SECRET_PASSCODE) {
      user.isMember = true
      await user.save()
      res.render('user_membership_form', { currentUser: user })
    } else {
      const error = "Incorrect secret passcode"
      res.render('user_membership_form', { error })
    }
  }
]

// Display a login form
exports.user_login_get = (req, res) => {
  if (req.session.messages) {
    res.render('login_form', { 
      title: 'Login',
      buttonText: 'Sign in', 
      user: req.session.user,
      errors: req.session.messages.map(msg => {
        return {
          msg
        }
      })})
  }
  res.render('login_form', { title: 'Login', buttonText: 'Sign in' })
}

// Handle authentication
exports.user_login_post = [
  body('username')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Username must be an email')
    .normalizeEmail(),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('login_form', { title: 'Login', buttonText: 'Sign in', errors: errors.array()})
    }
    next()
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
]

// Display form for making user admin
exports.user_admin_get = (req, res) => {
  res.render('admin_form')
}

// Handle making user admin
exports.user_admin_post = [
  body('secret_passcode')
    .trim()
    .escape(),
  body('userId')
    .trim()
    .escape(),
  async (req, res) => {
    const { userId, secret_passcode } = req.body
    if (secret_passcode !== config.SECRET_ADMIN_PASSCODE) {
      res.render('admin_form', { error: 'Incorrect secret password' })
    }
    const user = await User.findById(userId)
    user.isAdmin = true
    await user.save()
    res.render('admin_form')
  }
]
  