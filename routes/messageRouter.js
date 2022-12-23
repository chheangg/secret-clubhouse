const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

// GET request for creating message
router.get('/create', messageController.message_create_get)

// POST request for creating message
router.post('/create', messageController.message_create_post)

// POST request for deleting message
router.post('/delete', messageController.message_delete_post)

module.exports = router