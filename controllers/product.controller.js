//const fs = require("fs");
const Product = require("../models/product.model");
const ApiFilters = require("../utils/apiFilter");
const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/products");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `product-${req.params.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] == "image") {
    cb(null, true);
  } else {
    cb("Only image files are allowed", false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//exports.uploadProductThumbnail = upload.single("thumbnail");
//exports.uploadProductImages = upload.array("images", 5);
exports.uploadProductImagesAndThumbnail = upload.fields([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ message: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    //const filter = new ApiFilters(Product.find(), req.query)
    //  .filter()
    //  .sort()
    //  .fields()
    //  .pagination();
    //const productsList = await filter.query;
    //const productsList = await query;
    const productsList = await Product.find();
    
    res.status(200).json({
      message: "success",
      length: productsList.length,
      data: productsList,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getProductById = async (req, res) => {
  try {
   // const product = await Product.findById(req.params.id);
    const product = await Product.findById(req.params.id).populate(
      "categoryId").populate("reviewId");
    if (!product) throw new Error("Product not found");
    res.status(200).json({ message: "success", product });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const newProductData = { ...req.body };
    const updateProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      newProductData,
      {
        new: true,
      }
    ).select("_id title images thumbnail");

    if (req.files) {
      updateProduct.thumbnail = req.files.thumbnail[0].filename;
      req.files.images.forEach((image) => {
        updateProduct.images.push(image.filename);
      });

      await updateProduct.save();
    }

    res.status(200).json({
      message: "success",
      data: updateProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getTopRatedProducts = async (req, res, next) => {
  req.query.sort = "-rating";
  req.query.limit = "5";
  next();
};

exports.bestSellerProducts = async (req, res, next) => {
  req.query.sort = "-minimumOrderQuantity";
  req.query.limit = "10";
  req.query.fields = "title,price";
  next();
};

exports.computeProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      // Stages {}
      {
        $match: { rating: { $gte: 3.5 } },
      },
      {
        $group: {
          _id: "$category",
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          numOfProducts: { $sum: 1 },
        },
      },

      // {
      //   $sort: { price: -1 },
      // },
    ]);

    res.status(200).json({
      message: "success",
      length: stats.length,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};

exports.mostSoldProducts = async (req, res) => {
  try {
    const productsStats = await Product.aggregate([
      {
        $unwind: "$orderDates",
      },
      {
        $match: {
          orderDates: {
            $gte: new Date(`${req.params.year}-01-01`),
            $lte: new Date(`${req.params.year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$orderDates" },
          numOfOrders: { $sum: 1 },
          products: { $push: { title: "$title", price: "$price" } },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      { $sort: { numOfOrders: -1 } },
      // { $limit: 1 },
      { $project: { _id: 0 } },
    ]);

    res.status(200).json({
      message: "success",
      length: productsStats.length,
      data: productsStats,
    });
  } catch (error) {
    res.status(500).json({ message: "fail", err: error.message });
  }
};
