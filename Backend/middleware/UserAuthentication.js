const jwt = require("jsonwebtoken");
const { User } = require("../models/db");

exports.UserAuthentication = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    console.log(token);

    const userObj = jwt.verify(
      token,
      "kNImRb9lNAJ7YM4cpSYz-uei3G3PVwfQqd1nsX7kE3g"
    );
    console.log(userObj);
    const user = await User.findByPk(userObj.userId);
    if (!user) {
      res.status(400).json({ message: "user not found" });
    }
    req.user = userObj;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An occured error" });
  }
};
