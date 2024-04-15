const { DataTypes } = require("sequelize");

const TypesEnum = {
  clockIn: "Clock-In",
  clockOut: "Clock-Out",
}
module.exports = (sequelize, Sequelize) => {
const Absent = sequelize.define("absents", {
    id: {
      type : Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement : true
  },
  type: {
    type: DataTypes.ENUM,
    values: Object.values(TypesEnum),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
});
return Absent;
};

module.exports.TypesEnum = TypesEnum;