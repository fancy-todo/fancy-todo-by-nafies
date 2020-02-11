const { Todo } = require('../models')

module.exports = (req, res, next) => {
  Todo.findByPk(req.params.id)
    .then(todo => {
      if (todo) {
        if (todo.UserId == req.currentUserId) {
          next()
        } else {
          next({ msg: 'You are not authorized', status: 'not_authorized'})
        }
      } else {
        next({ msg: `Todo with id ${req.params.id} not found`, status: 'not_found'})
      }
    })
}