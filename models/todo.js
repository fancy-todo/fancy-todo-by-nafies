'use strict';
const today = new Date().toISOString().slice(0, 10)

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.Sequelize.Model
  class Todo extends Model {
    static associate (models) {
      this.belongsTo(models.User);
    }
  }

  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3],
          msg: "Minimum title length is 3"
        }
      }
    },
    description: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    due_date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: {
          args: today,
          msg: "Invalid due_date. It should be after today."
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize
  })

  return Todo;
}