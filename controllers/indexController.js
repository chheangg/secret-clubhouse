const Message = require('../models/message')

// Display index page
exports.index_page = async (req, res) => {
  const messages = req.user 
  ?
  await Message.find({}).populate('user')
  :
  await Message.find({}, { timestamp: 0, user: 0 }).populate('user')

  res.render('index', { messages })
}