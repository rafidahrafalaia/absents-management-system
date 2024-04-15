const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Role = sequelize.define("roles", {
    id: {
      type : Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement : true
  },
  name: {
    type:DataTypes.STRING,
    allowNull: false
  },
  description: {
    type:DataTypes.STRING,
    allowNull: true
  },
});
return Role;
};