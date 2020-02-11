const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library')

class UserController {
  static register (req, res, next) {
    const { name, email, password } = req.body
    if (!password) next({msg: 'password is undefined', status: 'bad_request'})
    if (password.length < 7) next({msg: 'Minimum password length is 6', status: 'bad_request'})
    User.create({ name, email, password })
      .then(user => {
        const token = jwt.sign({ id: user.id }, process.env.SECRET);
        res.status(201).json({
          msg: 'Register success',
          user,
          token
        })
      })
      .catch(next)
  }

  static login (req, res, next) {
    const { email, password } = req.body
    User.findOne({ where: { email }})
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET);
            res.status(200).json({
              msg: 'Login success',
              user,
              token
            })
          } else {
            next({
              name: 'invalid email/password',
              msg: 'Email / Password is wrong'
            })
          }
          
        } else {
          next({
            name: 'invalid email/password',
            msg: 'Email / Password is wrong'
          })
        }
      })
      .catch(next)
  }

  static googleSign (req, res, next) {
    let payload
    let status = {}
    const client = new OAuth2Client(process.env.CLIENT_ID);
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.CLIENT_ID
    })
      .then(ticket=>{
        payload = ticket.getPayload();
        const {email} = payload
        return User.findOne({ where: { email } })
      })
      .then(user=>{
        const { name } = payload
        const { email } = payload
        if (!user) {
          status.ids = 201
          status.msg = "user not found. Create user"
          return User.create({
            name,
            email,
            password: 'google-sign-password'
          })
        } else{
            status.msg = "user found"
            status.ids = 200
            return user
        }
      })
      .then(user=>{
        const idUser = user.id
        const token = jwt.sign({ id: idUser }, process.env.SECRET);
        res.status(status.ids).json({token, msg: status.msg})
      })
      .catch(err=>{
        next(err)
      })
  }
}

module.exports = UserController