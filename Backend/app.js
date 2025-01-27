const Express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

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
} = require("./controllers/UserControllers");

const { UserAuthentication } = require("./middleware/UserAuthentication");

const app = Express();

// Use middlewares
app.use(bodyparser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", SignUp);
app.post("/login", Login);
app.post("/add-expense", UserAuthentication, AddExpense);
app.post("/delete-expense",UserAuthentication, deleteExpense);
app.post("/get-expenses", UserAuthentication, GetExpenses);
app.post("/buypremium", UserAuthentication, BuyPremium);
app.post("/getallusers", UserAuthentication, GetallUsers);
app.post("/buypremium/updatestatus", UserAuthentication, UpdatePremium);
app.post("/Getpremium_state", UserAuthentication, GetUserPremiumStatus);
// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    console.log("Connected to the database");
    app.listen(4000, () => console.log("Server is running on port 4000"));
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
