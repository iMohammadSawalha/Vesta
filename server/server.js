const express = require("express");
const app = express();
require("dotenv").config();
const auth = require("./routes/auth");
const workspace = require("./routes/workspace");
const issue = require("./routes/issue");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/auth", auth);
app.use("/api/workspace", workspace);
app.use("/api/issue", issue);
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
