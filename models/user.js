'use strict';
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class User extends Model {
    static associate (models) {
      this.hasMany(models.Todo)
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email format. Please input valid email"
        }
      }
    },
    password: DataTypes.STRING
  }, {
    sequelize
  })

  User.addHook('beforeCreate', (user, options) => {
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
  })

  return User;
}