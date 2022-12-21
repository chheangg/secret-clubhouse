const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/userController')

// Get request for displaying all users
router.get('/', userController.user_list)

module.exports = router