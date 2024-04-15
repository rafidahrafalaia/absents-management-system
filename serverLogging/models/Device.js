const { DataTypes } = require("sequelize");

const TypesEnum = {
  clockIn: "Clock-In",
  clockOut: "Clock-Out",
}
module.exports = (sequelize, Sequelize) => {
const Device = sequelize.define("devices", {
    id: {
      type : Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement : true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fcm_token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  send_notif: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
});
return Device;
};