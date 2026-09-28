const express = require("express");
const userRouter = require("./routes/user.router.js");
const User = require("./models/user.model");
const Product = require("./models/product.model");
const productRouter = require("./routes/product.router.js");

const Review = require("./models/review.model");
const Category = require("./models/category.model");
const Order = require("./models/order.model");
const Cart = require("./models/cart.model");

const reviewRouter = require("./routes/review.router");
const categoryRouter = require("./routes/category.router");
const orderRouter = require("./routes/order.router");
const cartRouter = require("./routes/cart.router");
const authRouter = require("./routes/auth.router");

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.use("/api/reviews", reviewRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({ status: err.status, err: err.message });
});
module.exports = app;
