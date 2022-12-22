const { body, validationResult } = require('express-validator')
const message = require('../models/message')

// Model
const Message = require('../models/message')

// Display message creation form
exports.message_create_get = (req, res) => {
  res.render('message_form', { buttonText: 'Submit' })
}

// Handle message creation
exports.message_create_post = [
  body('title')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Title must not be empty'),
  body('message')
    .trim()
    .escape()
    .isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req)
    const body = req.body
    
    if (!errors.isEmpty()) {
      res.render('message_form', { buttonText: 'Submit', message: body, errors: errors.array() })
    }

    if (!req.user) {
      res.render('message_form', { buttonText: 'Submit', message: body, errors: [{ msg: 'Please login' }]})
    }

    const message = new Message({
      title: body.title,
      message: body.message,
      user: req.user._id,
    })

    await message.save()
    res.redirect('/')
  }
]