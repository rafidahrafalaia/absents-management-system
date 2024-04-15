const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('logging', 'root', 'rahasia', {
  host: 'localhost',
  dialect: 'mysql',
  port:'3306',
  logging: false  // Nonaktifkan logging 
});

  sequelize.devices = require("../Models/Device")(sequelize, Sequelize);
  sequelize.logUpdate = require("../Models/LogUpdate")(sequelize, Sequelize);
  
  module.exports = {
    // db: db,
    sequelize:sequelize
};
