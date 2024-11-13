const { User } = require("../models/db");

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
      return res.status(200).json({ message: "Name and email are required" });
    }

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password,
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

    if (user.password !== password) {
      return res.status(401).json({
        message: "Password Not Match Please Check",
      });
    }

    return res.status(200).json({
      message: "Login Successfull",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while logging in" });
  }
};
