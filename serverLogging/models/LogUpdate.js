const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const LogUpdate = sequelize.define("log_update", {
    id: {
      type : Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement : true
  },
  user_email: {
    type:DataTypes.STRING,
    allowNull: false
  },
  message: {
    type:DataTypes.STRING,
    allowNull: true
  },
});
return LogUpdate;
};