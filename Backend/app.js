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
app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.post("/api/signup", SignUp);
app.post("/api/login", Login);
app.post("/api/forgotpassword", forgetPassword);
app.post("/api/add-expense", UserAuthentication, AddExpense);
app.post("/api/delete-expense", UserAuthentication, deleteExpense);
app.post("/api/get-expenses", UserAuthentication, GetExpenses);
app.post("/api/buypremium", UserAuthentication, BuyPremium);
app.post("/api/getallusers", UserAuthentication, GetallUsers);
app.post("/api/buypremium/updatestatus", UserAuthentication, UpdatePremium);
app.post("/api/Getpremium_state", UserAuthentication, GetUserPremiumStatus);
app.get("/api/resetpassword/verify/:id", ResetPassVerifyLink);
app.post("/api/password/resetpassword", Resetpassword);
app.get("/api/dowload_expenses",UserAuthentication, DownloadExpenses);

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
