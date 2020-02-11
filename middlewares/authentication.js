const { User } = require('../models')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const { token } = req.headers
  if (token) {
    const decoded = jwt.verify(token, process.env.SECRET)
    User.findByPk(decoded.id)
      .then(user => {
        if (user) {
          req.currentUserId = user.id
          next()
        } else {
          next({ msg: 'Token is not valid. User not found', status: 'bad_request'})
        }
      })
  } else {
    next({ msg: 'Please login first', status: 'not_authorized'})
  }
}