const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  given_name: {
    type: String,
    required: true,
  },
  family_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  isMember: {
    type: Boolean,
    required: true,
  }
})

userSchema.virtual('full_name', function() {
  return this.family_name + ' ' + this.given_name;
})

userSchema.virtual('url', function() {
  return `/users/${this._id}`;
})

module.exports = mongoose.model("User", userSchema)