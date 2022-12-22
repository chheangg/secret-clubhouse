const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/userController')

// GET index homepage
router.get('/', (req, res) => {
  if (req.user) {
    res.send(`${req.user.family_name + ' ' + req.user.given_name} logged in`)
  }
  res.send('Nothing is here')
})

// Get request for creating a user
router.get('/sign-up', userController.user_create_get)

// Post request for creating a user
router.post('/sign-up', userController.user_create_post)

// Get request for user's membership
router.get('/membership', userController.user_membership_get)

// Post request for user's membership
router.post('/membership', userController.user_membership_post)

// Get request for signing in a user
router.get('/log-in', userController.user_login_get)

// Post request for signing in a user
router.post('/log-in', userController.user_login_post)

module.exports = router