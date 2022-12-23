const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/userController')

// GET request for user's admin perm
router.get('/admin', userController.user_admin_get)

// POST request for user's amdin perm
router.post('/admin', userController.user_admin_post)

module.exports = router