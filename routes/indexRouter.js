const express = require('express')
const router = express.Router()

// GET index homepage
router.get('/', (req, res) => {
  res.send('ROUTE: index homepage')
})

module.exports = router