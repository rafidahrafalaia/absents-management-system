const mysql = require("mysql");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('employee', 'root', 'rahasia', {
  host: 'localhost',
  dialect: 'mysql',
  port:'3306',
  logging: false  // Nonaktifkan logging 
});

  sequelize.users = require("../models/Users")(sequelize, Sequelize);
  sequelize.role = require("../models/Role")(sequelize, Sequelize);
  sequelize.absents = require("../models/Absent")(sequelize, Sequelize);
  
  sequelize.users.belongsToMany(sequelize.role, { 
    through: 'user_roles',
    foreignKey: "userId",
    otherKey: "roleId" 
  });
  
  sequelize.role.belongsToMany(sequelize.users, { 
    through: 'user_roles',
    foreignKey: "roleId",
    otherKey: "userId" 
  });

  
  sequelize.users.hasMany(sequelize.absents, {
    foreignKey: 'userId',
    as: 'absents',
  });

  sequelize.absents.belongsTo(sequelize.users, {
    foreignKey: 'userId',
    as: 'users',
  });
  module.exports = {
    // db: db,
    sequelize:sequelize
};
