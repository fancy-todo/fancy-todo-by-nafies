module.exports = (err, req, res, next) => {
  console.log(err)
  if (err.status === 'bad_request') {
    res.status(400).json({
      msg: err.msg
    })
  } 
  else if (err.status === 'not_authorized') {
    res.status(401).json({
      msg: err.msg
    })
  } 
  else if (err.status === 'not_found') {
    res.status(404).json({
      msg: err.msg
    })
  } 
  else if (err.name === 'invalid email/password') {
    res.status(400).json(err)
  }
  else if (err.name === 'JsonWebTokenError') {
    err.description = 'Token is invalid. Please input a valid token or login to get your token.'
    res.status(400).json(err)
  }  
  else if (err.name === 'SequelizeUniqueConstraintError') {
    let errors = []
    err.errors.forEach(error => {
      if (error.message === 'email must be unique') {
        errors.push({ 
          msg: 'Email has been registered. Please login or register with another email',
          name: 'duplicate_email'
        })
      } 
    })
    res.status(400).json({
      errors,
      name: err.name
    })
  }
  else if (err.name === 'SequelizeValidationError') {
    let errors = []
    err.errors.forEach(error => {
      errors.push({ 
        msg: error.message,
      })
    })
    res.status(400).json({
      errors,
      name: err.name
    })
  }
  else {
    res.status(500).json(err)
  }
}