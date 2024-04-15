const { Sequelize, Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
const Users = sequelize.define("users", {
    id: {
      type : Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement : true
  },
  username: {
    type:DataTypes.STRING,
    allowNull: false
  },
  jabatan: {
    type:DataTypes.STRING,
    allowNull: false
  },
  email: {
    type:DataTypes.STRING,
    allowNull: false
  },
  password: DataTypes.STRING(500),
  role: DataTypes.INTEGER,
  avatar: DataTypes.STRING,
  office_number: DataTypes.STRING,
  personal_number: DataTypes.STRING,
  // permission: DataTypes.STRING
});
return Users;
};