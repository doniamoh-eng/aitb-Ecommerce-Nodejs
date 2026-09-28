const Order = require("../models/order.model");
exports.createOrder = async (req, res) => {
    try {
      const newOrder = await Order.create({...req.body,userId:req.user._id});
      res.status(201).json({ message: "success", data: newOrder });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getAllOrders = async (req, res) => {
    try {
      const orderslist = await Order.find().populate("userId").populate("products");
  
      res.status(201).json({ message: "success", data: orderslist });
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("userId").populate("products");
      // const product = await Product.findById(req.params.id).populate(
      //   "categoryId",
      //   "title createdAt"
      // );
      // find
      if (!order) throw new Error("order not found");
  
      res.status(200).json({ message: "success", order });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  exports.updateOrder = async (req, res) => {
    try {
      const orderExists = await Order.findById(req.params.id);
      if (!orderExists) throw new Error("order not found");
  
      const updateOrder = await Order.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      ).populate("userId").populate("products");
  
      res.status(200).json({
        message: "success",
        data: updateOrder,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.deleteOrder = async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id).populate("userId").populate("products");
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };