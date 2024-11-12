const { User } = require("../models/db");

exports.AddNewUser = async (req, res) => {
  try {
    // Extract `name` and `email` from the request body
    const { name, email, password } = req.body.formData;
    console.log(req.body.formData);

    // Validate input
    if (!name || !email || !password) {
      return res.status(200).json({ error: "Name and email are required" });
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
