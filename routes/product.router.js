const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopRatedProducts,
  bestSellerProducts,
  computeProductStats,
  mostSoldProducts,
  uploadProductImagesAndThumbnail,
} = require("../controllers/product.controller");
const { protect } = require("../controllers/auth.controller");

const productRouter = express.Router();
productRouter.get("/",protect, getAllProducts);
productRouter.get("/top-rated", getTopRatedProducts, getAllProducts);
productRouter.get("/best-seller", bestSellerProducts, getAllProducts);
productRouter.get("/stats", computeProductStats);
productRouter.get("/most-sold/:year", mostSoldProducts);
productRouter.get("/:id", protect, getProductById);
//productRouter.get("/:id", ,getProductById);
productRouter.post("/", createProduct);
productRouter.patch("/:id",uploadProductImagesAndThumbnail, updateProduct);
productRouter.delete("/:id", deleteProduct);
module.exports = productRouter;