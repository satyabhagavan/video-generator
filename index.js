const express = require("express");
require("dotenv").config();
// const mongoose = require("mongoose");
var bodyParser = require("body-parser");
// var multer = require("multer");
// var upload = multer();

const app = express();
const port = 3000;
app.use(express.json());
app.set("view engine", "pug");
app.set("views", "./views");

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
// app.use(upload.array());
app.use(express.static("public"));

// const uri = process.env.DB_URL;
// mongoose.set("strictQuery", true);
// mongoose.connect(uri);
const routes = require("./routes/routes.js");
const merges = require("./routes/merges.js");

// //checking the connection to the db
// const connection = mongoose.connection;
// connection.once("open", () => {
//   console.log("MongoDB database connection established successfully");
// });

app.use("/", routes);
app.use("/merge", merges);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
