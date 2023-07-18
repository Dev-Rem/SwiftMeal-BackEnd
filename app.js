require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const restaurantsRouter = require("./routes/restaurant");
const addressRouter = require("./routes/address");
const accountRouter = require("./routes/auth");
const menuRouter = require("./routes/menu");
const foodRouter = require("./routes/menuItem");
const itemRouter = require("./routes/item");
const cartRouter = require("./routes/cart");
const paymentRouter = require("./routes/payment");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.listen(4000, () => {
  console.log("listening on localhost:4000");
});

mongoose.connect(
  "mongodb://127.0.0.1:27017/swiftmeal-db",
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error) => {
    if (error) return console.error(error);
    console.log("Connected to Database");
  }
);
mongoose.set("returnOriginal", false);
mongoose.set("useFindAndModify", false);

// console.log(require("crypto").randomBytes(64).toString("hex"));

// view engine setup
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use("/api/restuarants", restaurantsRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/auth", accountRouter);
app.use("/api/menus", menuRouter);
app.use("/api/menu-items", foodRouter);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);

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
  // res.render("error");
});

module.exports = app;
