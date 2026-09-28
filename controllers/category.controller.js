const Category = require("../models/category.model");
exports.createCategory = async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);
  
      res.status(201).json({ message: "success", data: newCategory });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getAllCategories = async (req, res) => {
    try {
      const categorieslist = await Category.find();
  
      res.status(200).json({ message: "success", data: categorieslist });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      // const product = await Product.findById(req.params.id).populate(
      //   "categoryId",
      //   "title createdAt"
      // );
      // find
      if (!category) throw new Error("category not found");
  
      res.status(200).json({ message: "success", data: category });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  exports.updateCategory= async (req, res) => {
    try {
      const categoryExists = await Category.findById(req.params.id);
      if (!categoryExists) throw new Error("category not found");
  
      const updateCategory = await Category.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
  
      res.status(200).json({
        message: "success",
        data: updateCategory,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };