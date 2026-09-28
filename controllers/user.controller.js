const fs = require("fs");
const User = require("../models/user.model.js");
const ApiFilters = require("../utils/apiFilter");
const { sendEmail } = require("../utils/email");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
exports.getAllUsers = async (req, res) => {
  try {
    const filter = new ApiFilters(User.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();
  // console.log(filter.query);
  const usersList = await filter.query;
    //const usersList = await query;
    //const usersList = await User.find();
    res.status(200).json({message: "success",length: usersList.length,data: usersList});
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
};
exports.getUserById = async(req, res) => {
  try {
    const user = await User.findOne({ _Id: req.params.id });
    if (!user) throw new Error("user not found");
    res.status(200).json({ message: "success", user });
  } catch (error) {
    res.status(500).json({ message: "fail", err:error.message });
  }
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "success", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "fail", error });
  }
  };
  exports.updateUser = async (req, res) => {
    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: req.params.id },req.body,{new: true}
      );
      res.status(200).json({ message: "success", data: updateUser });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ message: "fail", error });
    }
  };
  exports.getUserGender = async (req, res, next) => {
    req.query.fields = "gender";
    next();
  };
  exports.getUserCity = async (req, res, next) => {
    req.query.fields = "name,address.city";
    req.query.sort = "city";
    req.query.limit="4";
    next();
  };
  exports.info = async (req, res) => {
    try {
      const info = await User.aggregate([
      
        {
          $group: {
            _id: "$name",
          },
        },
        {
          $addFields: {info : "$_id" },
        },
        
      ]);
  
      res.status(200).json({
        message: "success",
        length: info.length,
        data: info,
      });
    } catch (error) {
      res.status(500).json({ message: "fail", err: error.message });
    }
  };
  
  exports.forgetPassword = catchAsync(async (req, res, next) => {
    // Get user by email
    const { email } = req.body;
  
    const userExists = await User.findOne({
      email,
    }).select("+password");
    if (!userExists)
      return res.status(200).json({
        status: "success",
      });
  
    // generate random token
    const resetToken = userExists.createPasswordResetToken();
    // await userExists.save({ validationBeforeSave: false });
    await userExists.save();
    // send email with token
  
    // http://localhost:3000/api
    const resetUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/users/resetPassword/${resetToken}`;
    const mailOptions = {
      emilTo: email,
      emailSubject: "E-Commerce Reset password",
      message: `You are receiving this message because you have requested to reset your password, if not please ignore this message \n Click here to reset your password:\n${resetUrl}\nThis link is valid for 10 minutes.`,
    };
    try {
      await sendEmail(mailOptions);
  
      res.status(200).json({
        status: "success",
        message: "Mail Sent",
      });
    } catch (error) {
      res.status(200).json({
        status: "error",
        message: error.message,
      });
    }
  });
  
  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get token from params
    const { token } = req.params;
  
    // 2) get user from token
    // 3) check if token is not expired
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);
  
    const userExists = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiration: { $gt: Date.now() },
    });
  
    // 4) if so, set new password
    if (!userExists) {
      return next(new AppError("Token is invalid or expired", 400));
    }
    userExists.password = req.body.password;
    userExists.passwordResetToken = undefined;
    userExists.passwordResetTokenExpiration = undefined;
    // userExists.passwordChangedAt = Date.now();
  
    await userExists.save();
    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  });
  