const express = require("express");
const app = express();
require("dotenv").config();
const login = require("./routes/auth");
const { authenticateToken } = require("./middleware/tokenAuth");
const mongoose = require("mongoose");
app.use(express.json());
app.use("/api/auth", login);

//       TESTING      //
const issues = [
  {
    user_email: "yaser",
    issues: "yaser issues",
  },
  {
    user_email: "ahmad",
    issues: "ahmad issues",
  },
];
app.get("/issues", authenticateToken, (req, res) => {
  res.json(issues.filter((issue) => issue.user_email === req.user.user_email));
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database : ", error);
  });

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
