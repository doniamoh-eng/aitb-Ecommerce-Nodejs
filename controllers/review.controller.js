const Review = require("../models/review.model");
exports.createReview= async (req, res) => {
    try {
      const newReview = await Review.create(req.body);
  
      res.status(201).json({ message: "success", data: newReview });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getAllReviews = async (req, res) => {
    try {
      const reviewslist = await Review.find();
  
      res.status(200).json({ message: "success", data: reviewslist });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getReviewById = async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      // const product = await Product.findById(req.params.id).populate(
      //   "categoryId",
      //   "title createdAt"
      // );
      // find
      if (!review) throw new Error("review not found");
  
      res.status(200).json({ message: "success", data: review });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  exports.updateReview= async (req, res) => {
    try {
      const reviewExists = await Review.findById(req.params.id);
      if (!reviewExists) throw new Error("review not found");
  
      const updateReview = await Review.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
  
      res.status(200).json({
        message: "success",
        data: updateReview,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.deleteReview = async (req, res) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };