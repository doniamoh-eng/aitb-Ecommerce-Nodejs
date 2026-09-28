const express = require("express");
const {
  createCart,
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
} = require("../controllers/cart.controller");
const { protect } = require("../controllers/auth.controller");
const { modifyCart } = require("../controllers/cart.controller");


const cartRouter = express.Router();
cartRouter.get("/", getAllCarts);
cartRouter.get("/:id" ,getCartById);
cartRouter.post("/", protect,createCart);
cartRouter.patch("/:id", updateCart);
cartRouter.delete("/:id", deleteCart);
cartRouter.patch("/", protect, modifyCart);
module.exports = cartRouter;