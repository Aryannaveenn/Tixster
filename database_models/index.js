const { Sequelize } = require('sequelize');

// set up sqlite db
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;
