const Cart = require("../models/cart.model");
const ApiFilters = require("../utils/apiFilter");
const CartItem = require("../models/cartItem.model")
const Product = require("../models/product.model");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({...req.body,userId:req.user._id});
      res.status(201).json({ message: "success", data: newCart });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  
  exports.getAllCarts = async (req, res) => {
    try {
      //const filter = new ApiFilters(Product.find(), req.query)
      //  .filter()
      //  .sort()
      //  .fields()
      //  .pagination();
      // console.log(filter.query);
      //const productsList = await filter.query;
      const cartsList = await Cart.find().populate(
        "products").populate(
          "userId");
    
      res.status(200).json({
        message: "success",
        length: cartsList.length,
        data: cartsList,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", error: error.message });
    }
  };
  
  exports.getCartById = async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.id).populate(
        "products").populate(
          "userId");
      // const product = await Product.findById(req.params.id).populate(
      //   "categoryId",
      //   "title createdAt"
      // );
      // find
      if (!cart) throw new Error("cart not found");
  
      res.status(200).json({ message: "success", cart });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.updateCart = async (req, res) => {
    try {

      //const productExists = await Product.findById(req.params.id);
      //if (!productExists) throw new Error("Product not found");
  
      const updateCart = await Cart.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "success",
        data: updateCart,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.deleteCart = async (req, res) => {
    try {
  //    const user = await User.findById(req.body.userId);
      await Cart.findByIdAndDelete(req.params.id);
  //    user.cart.push(deletedCart);
  //    await user.save();
      res.status(204).json();
   } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };

// Add item to cart, change quantity , delete item from cart
exports.modifyCart = catchAsync(async (req, res, next) => {
  // Get user's cart
  const userId = req.user._id;
  // get his cart
  const userCart = await Cart.findOne({
    userId,
  });

  // validate products
  const foundProducts = await Promise.all(
    req.body.products.map(async (product) => {
      const foundProd = await Product.findById(product.productId);
      if (!foundProd) return "not-found";
      return product;
    })
  );

  if (foundProducts.includes("not-found"))
    return next(new AppError("Product not found", 404));

  // modify cart
  await Promise.all(
    foundProducts.map(async (product) => {
      const cartItemExists = await CartItem.findOne({
        cartId: userCart._id,
        productId: product.productId,
      });
      if (cartItemExists) {
        if (product.quantity < 1) {
          await CartItem.findByIdAndDelete(cartItemExists._id);
        } else {
          cartItemExists.quantity = product.quantity;
          await cartItemExists.save();
        }
      } else {
        await CartItem.create({
          cartId: userCart._id,
          productId: product.productId,
          quantity: product.quantity > 0 ? product.quantity : 1,
        });
      }
    })
  );

  res.status(200).json({
    status: "success",
    message: "Cart Changed",
    data: CartItem,
  });
});
