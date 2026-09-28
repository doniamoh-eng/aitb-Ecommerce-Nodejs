const { token } = require("morgan");
const User = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET) //,{
   // expiresIn: process.env.JWT_EXPIRES_IN,
  //});

exports.signUp = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, username, password, phone, age, gender } =
    req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
    phone,
    age,
    gender,
  });

  const token = signToken({ id: newUser._id, role: newUser.role });

  res.status(201).json({
    message: "success",
    length: newUser.length,
    data: newUser,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));
  const userExits = await User.findOne({ email }, "+password");
  if (!userExits || !(await userExits.comparePassword(password))) {
    return next(new AppError("Wrong email or password", 401));
  }
  // token
  const token = signToken({ id: userExits._id, role: userExits.role });

  res.cookie("token", token);

  res.status(201).json({
    message: "success",
    token,
  });
});



exports.protect = catchAsync(async (req, res, next) => {
  //   Get token
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("You are not logged in, please login first", 401));
  }
  // Validate token
  const token = req.headers.authorization.split(" ")[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("🚀 ~ exports.protect=catchAsync ~ decoded:", decoded);

  // Get user from token, check if its exists
  const userExits = await User.findById(decoded.id);
  if (!userExits)
    return next(new AppError("This user is no longer exists", 404));

  // password changed after token has been created

  req.user = userExits;

  next();
});