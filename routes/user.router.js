const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserGender,
  getUserCity,
  info,
  forgetPassword,
  resetPassword,
} = require("../controllers/user.controller.js");
const userRouter = express.Router();
userRouter.get("/", getAllUsers);
userRouter.get("/gender",getUserGender ,getAllUsers);
userRouter.get("/city",getUserCity ,getAllUsers);
userRouter.get("/info", info);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
module.exports = userRouter;