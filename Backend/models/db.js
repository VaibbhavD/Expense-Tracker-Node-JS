const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("expense", "root", "Vaibhav@123", {
  host: "localhost",
  dialect: "mysql",
  port: 3300,
});

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = { sequelize, User };
