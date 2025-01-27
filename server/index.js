const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const cors = require("cors");
const multer = require("multer");

dotenv.config();

const app = express();

let corsOptions = {
  origin: ["http://localhost:5000"],
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

app.use("/api/user", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
