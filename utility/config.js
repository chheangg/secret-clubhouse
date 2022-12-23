require('dotenv').config()
const nconf = require('nconf').argv().env()

const SECRET_PASSCODE = nconf.get('SECRET_PASSCODE')
const SECRET_ADMIN_PASSCODE = nconf.get('SECRET_ADMIN_PASSCODE')
const SECRET = nconf.get('SECRET')
const PORT = nconf.get('PORT')
const NODE_ENV = nconf.get('NODE_ENV')
const MONGODB_URI = NODE_ENV === 'test' ? nconf.get('MONGODB_URI_TEST') : nconf.get('MONGODB_URI')

module.exports = {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  SECRET_PASSCODE,
  SECRET_ADMIN_PASSCODE,
  SECRET
}