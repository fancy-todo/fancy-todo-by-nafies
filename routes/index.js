const router = require('express').Router()
const todos = require('./todos')
const auth = require('./auth')

router.get('/', (req, res) => {
  res.status(200).json('Welcome to fancy-todo API')
})
router.use('/todos', todos)
router.use('/auth', auth)

module.exports = router