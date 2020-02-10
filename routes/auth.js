const router = require('express').Router()
const User = require('../controllers/UserController')

router.post('/register', User.register)
router.post('/login', User.login)
router.post('/googleSign', User.googleSign)

module.exports = router