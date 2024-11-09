const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Event = require('./event');

// booking model
const Booking = sequelize.define('Booking', {
  seats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',  // The table name that this foreign key is referencing
      key: 'id'        // The key in the referenced model (Users table)
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',  // The table name that this foreign key is referencing
      key: 'id'         // The key in the referenced model (Events table)
    }
  }
});


module.exports = Booking;
