require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");

const restaurantsRouter = require("./routes/restaurant");
const addressRouter = require("./routes/address");
const accountRouter = require("./routes/auth");
const sectionRouter = require("./routes/section");
const menuRouter = require("./routes/menu");
const foodRouter = require("./routes/food");
const itemRouter = require("./routes/item");
const cartRouter = require("./routes/cart");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.listen(process.env.PORT, () => {
  console.log("listening on localhost: ${process.env.PORT}");
});

mongoose.connect(
  process.env.DATABASE,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error) => {
    if (error) return console.error(err);
    console.log("Connected to Database");
  }
);
mongoose.set("returnOriginal", false);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/restuarants", restaurantsRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/auth/", accountRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/menus", menuRouter);
app.use("/api/foods", foodRouter);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
