const { body, validationResult } = require('express-validator')

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

// Handle message deletion
exports.message_delete_post = [
  body('messageId')
    .trim()
    .escape(),
  async (req, res) => {
    const { messageId } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('index')
      return
    }

    await Message.findByIdAndDelete(messageId)
    res.render('index')
  }
]