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
  isPremium: {
    type: DataTypes.BOOLEAN,
  },
  totalexpense: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
});

const Expenses = sequelize.define("expenses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // Name of the target table
      key: "id", // Column name in the target table
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentid: {
    type: DataTypes.STRING,
    allowNull: true, // This can be null initially (before payment is completed)
  },
  orderid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Expenses, { foreignKey: "user_id", onDelete: "CASCADE" });
Expenses.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, User, Expenses, Order };
