const { User, Expenses } = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const GetJwtToken = (user) => {
  return jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    "kNImRb9lNAJ7YM4cpSYz-uei3G3PVwfQqd1nsX7kE3g"
  );
};

exports.SignUp = async (req, res) => {
  try {
    // Extract `name` and `email` from the request body
    const { name, email, password } = req.body.formData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists with this email." });
    }

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(401)
        .json({ message: "Please Enter All Creditantional" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Send a success response with the new user's data
    res.status(201).json({
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error adding new user:", error);
    res.status(500).json({ error: "An error occurred while adding the user" });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body.formData;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User Not Found Please Sign Up" });
    }

    const PasswordIsMatch = await bcrypt.compare(password, user.password);

    if (!PasswordIsMatch) {
      return res.status(401).json({
        message: "Password Not Match Please Check",
      });
    }

    return res.status(200).json({
      message: "Login Successfull",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: GetJwtToken(user),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while logging in" });
  }
};

exports.AddExpense = async (req, res) => {
  try {
    console.log(req.body);
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      res.status(401).json({ message: "Please Enter Valid Information" });
    }

    const expense = await Expenses.create({
      amount,
      description,
      category,
      user_id: req.user.userId,
    });
    res.status(200).json({ message: "Expense Added Successfully", expense });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured while adding the user" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Expense ID is Required" });
    }
    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(400).json({ message: "Expense Not Found" });
    }
    await expense.destroy();

    res.status(200).json({ message: "Expense Delete Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while deleting the expenses" });
  }
};

exports.GetExpenses = async (req, res) => {
  try {
    const { userId } = req.user; // Corrected de-structuring
    console.log("User_id", userId);
    const expenses = await Expenses.findAll({ where: { user_id: userId } });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    res
      .status(200)
      .json({ message: "Expenses retrieved successfully", expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving expenses" });
  }
};
