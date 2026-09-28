const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const { protect } = require("../controllers/auth.controller");

const orderRouter = express.Router();
orderRouter.get("/", getAllOrders);
orderRouter.get("/:id" ,getOrderById);
orderRouter.post("/",protect ,createOrder);
orderRouter.patch("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);
module.exports = orderRouter;
