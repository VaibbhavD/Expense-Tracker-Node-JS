const Express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const { sequelize } = require("./models/db");
const {
  SignUp,
  Login,
  AddExpense,
  deleteExpense,
  GetExpenses,
  BuyPremium,
  UpdatePremium,
  GetUserPremiumStatus,
  GetallUsers,
  forgetPassword,
  ResetPassVerifyLink,
  Resetpassword,
  DownloadExpenses
} = require("./controllers/UserControllers");

const { UserAuthentication } = require("./middleware/UserAuthentication");

const app = Express();

// Use middlewares
app.use(bodyparser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(compression());
// Define a route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", SignUp);
app.post("/login", Login);
app.post("/forgotpassword", forgetPassword);
app.post("/add-expense", UserAuthentication, AddExpense);
app.post("/delete-expense", UserAuthentication, deleteExpense);
app.post("/get-expenses", UserAuthentication, GetExpenses);
app.post("/buypremium", UserAuthentication, BuyPremium);
app.post("/getallusers", UserAuthentication, GetallUsers);
app.post("/buypremium/updatestatus", UserAuthentication, UpdatePremium);
app.post("/Getpremium_state", UserAuthentication, GetUserPremiumStatus);
app.get("/resetpassword/verify/:id", ResetPassVerifyLink);
app.post("/password/resetpassword", Resetpassword);
app.get("/dowload_expenses",UserAuthentication, DownloadExpenses);

// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT || 4000, () =>
      console.log("Server is running on port 4000")
    );
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
