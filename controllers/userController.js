// Display a list of all users
exports.user_list = (req, res) => {
  res.send('ROUTE: GET USERS')
}

// Display a form for creating user, or signing them up.
exports.user_create_get = (req, res) => {
  res.send('ROUTE: GET USER CREATE')
}

// Handle the creation of a user
exports.user_create_post = [
  (req, res) => {
    res.send('ROUTE: GET USER post')
  }
]