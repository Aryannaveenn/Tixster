
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./index'); 

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    unique: true,  //has to be unique
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;
