const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    minLength: 3,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})

messageSchema.virtual('url', function() {
  return `/messages/${this._id}`
})

module.exports = mongoose.model('Message', messageSchema)