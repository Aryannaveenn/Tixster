const { DataTypes } = require('sequelize');
const sequelize = require('./index');

// events model
const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
}});

module.exports = Event;
