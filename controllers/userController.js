const bcrypt = require('bcrypt')
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const config = require('../utility/config')

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
    if (!errors.isEmpty()) {
      res.render('user_form', {
        title: 'Sign up user',
        buttonText: 'Sign-up',
        user: body,
        errors: errors.array()
      })
      return
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      given_name: body.given_name,
      family_name: body.family_name,
      username: body.family_name,
      password: passwordHash,
      isMember: false
    })
    await user.save()
    res.redirect('/') 
  }
]

