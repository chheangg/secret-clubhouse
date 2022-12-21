const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/userController')

// Get request for creating a user
router.get('/sign-up', userController.user_create_get)

// Post request for creating a user
router.post('/sign-up', userController.user_create_post)

// Get request for user's membership
router.get('/membership', userController.user_membership_get)

// Post request for user's membership
router.post('/membership', userController.user_membership_post)

module.exports = router