const { User, Expenses, Order } = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

const GetJwtToken = (user) => {
  return jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    "kNImRb9lNAJ7YM4cpSYz-uei3G3PVwfQqd1nsX7kE3g" //Secret Key
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
      return res.status(202).json({ message: "User Not Found Please Sign Up" });
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
        isPremium: user.isPremium,
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
    const { amount, description, category } = req.body;

    // Validate request data
    if (!amount || !description || !category) {
      return res
        .status(400)
        .json({ message: "Please enter valid information" });
    }

    const parsedAmount = parseFloat(amount); // Ensure amount is a number
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    // Create a new expense
    const expense = await Expenses.create({
      amount: parsedAmount,
      description,
      category,
      user_id: req.user.userId,
    });

    // Update user's total expense
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle cases where totalexpense might be null or undefined
    user.totalexpense = (user.totalexpense || 0) + parsedAmount;
    console.log(user.totalexpense);
    await user.save();

    // Respond with success
    res.status(200).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      message: "An error occurred while adding the expense",
    });
  }
};

exports.deleteExpense = async (req, res) => {
  console.log(req.user);
  // console.log(req.)
  try {
    const { id, user_id } = req.body;

    // Validate request data
    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    // Find the expense
    const expense = await Expenses.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.destroy(); 

    // Find the user
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.totalexpense = user.totalexpense - expense.amount;
    console.log(user.totalexpense);
    await user.save();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the expense" });
  }
};

exports.GetExpenses = async (req, res) => {
  try {
    const { userId } = req.user; // Extract user ID from the request

    // Fetch user-specific expenses
    const userExpenses = await Expenses.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Fetch user-specific fields
        },
      ],
    });

    // Fetch all expenses and include associated user info
    const allExpenses = await Expenses.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // Fetch user fields
        },
      ],
    });

    // Check if the user has no expenses
    if (!userExpenses || userExpenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this user" });
    }

    res.status(200).json({
      message: "Expenses retrieved successfully",
      Expenses: userExpenses,
      allExpenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving expenses" });
  }
};

exports.BuyPremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_4w92rPTdK5vaWB",
      key_secret: "FGenJCuLlXZKym039212cFIp",
    });

    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.error("Razorpay Order Creation Error:", err);
        return res
          .status(500)
          .json({ error: "Failed to create Razorpay order" });
      }

      try {
        // Save the order details to the database
        await Order.create({
          orderid: order.id,
          status: "PENDING",
          userId: req.user.id, // Save userId to link with the user
        });

        return res.status(201).json({ order, key_id: rzp.key_id });
      } catch (dbError) {
        console.error("Database Error:", dbError);
        return res
          .status(500)
          .json({ error: "Failed to save order in database" });
      }
    });
  } catch (error) {
    console.error("Error in BuyPremium:", error);
    res.status(500).json({ message: "Something Went Wrong", error });
  }
};

exports.UpdatePremium = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;

    // Check if payment_id and order_id are provided
    if (!payment_id || !order_id) {
      return res
        .status(400)
        .json({ message: "Payment ID and Order ID are required" });
    }

    // Find the order with the given order_id
    const order = await Order.findOne({ where: { orderid: order_id } });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already processed (to avoid duplicate updates)
    if (order.status === "SUCCESSFUL") {
      return res
        .status(400)
        .json({ message: "Order has already been processed" });
    }

    // Update the order with payment details
    await order.update({ paymentid: payment_id, status: "SUCCESSFUL" });

    // Find the user by userId from the JWT (assuming userId is in the JWT payload)
    const user = await User.findByPk(req.user.userId); // Assuming the userId is available in req.userId
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user is not already a premium user
    if (user.isPremium) {
      return res
        .status(400)
        .json({ message: "User is already a premium member" });
    }

    // Update the user's premium status
    await user.update({ isPremium: true });

    return res.status(202).json({
      success: true,
      message: "Transaction successful. You are now a premium member.",
    });
  } catch (error) {
    console.error("Error in UpdatePremium:", error);
    return res.status(500).json({
      message: "Something went wrong while updating premium status",
      error,
    });
  }
};

exports.GetUserPremiumStatus = async (req, res) => {
  try {
    // Fetch user ID from the authenticated request (assuming req.userId is set)
    const userId = req.user.userId; // Ensure userId is available after authentication middleware

    // Retrieve the user's premium status
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the premium status (true or false)
    return res.status(200).json({
      isPremium: user.isPremium,
    });
  } catch (error) {
    console.error("Error in GetUserPremiumStatus:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.GetallUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in GetallUsers:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
