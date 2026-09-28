const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    address: Object,
    email: {
      type: String,
      require: [true, "User must have an email"],
      unique: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    gender: {
      type:String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female or other",
      },
    },
    username: {
      type: String,
      require: [true, "User must have a username"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "User must have a password"],
      select: false,
     // validate: {
     //   validator: function (value) {
      //    return RegExp(
      //      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-z]).{8,}$/
       //   ).test(value);
       // },
       // message:
       //   "Password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character",
      //},
    },
    //name: {
      firstName: { 
        type: String,
        require: [true, "User must have a first name"],
        minlength: [3, "User first name must be at least 3 characters"],
        maxlength: [15, "User first name must be less than 15 characters"],
        validate: {
          validator: function (value) {
            const locales = ["ar-AE", "en-US"];
            return locales.some((locale) =>
              validator.isAlpha(value, locale, { ignore: " " })
            );
          },
          message: "First name must contain alpha only",
      },
      },
        lastName: { 
          type: String,
          require: [true, "User must have a last name"],
          minlength: [3, "User last name must be at least 3 characters"],
          maxlength: [15, "User last name must be less than 15 characters"],
          validate: {
            validator: function (value) {
              const locales = ["ar-AE", "en-US"];
              return locales.some((locale) =>
                validator.isAlpha(value, locale, { ignore: " " })
              );
            },
            message: "Last name must contain alpha only",
        }
      },
    //},
    phone: {
      type: String,
      require: [true, "User must have a phone number"],
      unique: true,
      validate: {
        validator: function (value) {
          return RegExp(/^01[0-2,5]{1}[0-9]{8}$/gm).test(value);
        },
        message: "Invalid phone number",
      },
    },
    age: {
      type: Number,
      min: [16, "User must be at least 16 years old"],
      max: [100, "User must be less than 100 years old"],
    },
    //fullAddress: String,
    role: {
      type: String,
      enum: {
        values: ["admin", "customer", "supplier"],
        message: "Role must be admin, customer, supplier ",
      },
      default: "customer",
    },
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
    passwordChangedAt: Date,
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);

  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;
  console.log(this.passwordResetToken, resetToken);

  return resetToken;
};

//userSchema.pre("save", function (next) {
 // this.fullAddress=
 // this.address.number + " " + this.address.street + " " + this.address.city + " " + this.address.zipcode;
 // next();
//});
//userSchema.pre("find", function (next) {
 // this.find({ gender: { $ne: "male" } });
 // next();
//});
//userSchema.pre("aggregate", function (next) {
 // this._pipeline.push({
 //   $project: { _id: 0 } 
 // });
 // console.log(this._pipeline);
 // next();
//});
//userSchema.virtual("fullName").get(function () {
 // return this.name.firstName + " " + this.name.lastName;
//});
const User = new mongoose.model("User", userSchema);
module.exports = User;
