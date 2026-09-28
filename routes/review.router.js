const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");
const reviewRouter = express.Router();
reviewRouter.get("/", getAllReviews);
reviewRouter.get("/:id", getReviewById);
reviewRouter.post("/", createReview);
reviewRouter.patch("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);
module.exports = reviewRouter;