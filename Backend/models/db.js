const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("expense", "root", "Vaibhav@123", {
  host: "localhost",
  dialect: "mysql",
  port: 3300,
});
module.exports = { sequelize };
