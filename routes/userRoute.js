const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/userController')

// Get request for creating a user
router.get('/create', userController.user_create_get)

// Post request for creating a user
router.post('/create', userController.user_create_post)

module.exports = router