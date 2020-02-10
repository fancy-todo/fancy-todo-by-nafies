const router = require('express').Router()
const todos = require('./todos')
const auth = require('./auth')

router.use('/todos', todos)
router.use('/auth', auth)

module.exports = router