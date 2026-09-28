const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const validator = require("validator");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product must have a title"],
    unique: true,
    minlength: [3, "product title must be at least 3 characters"],
      maxlength: [15, "product title must be less than 15 characters"],
      validate: {
        validator: function (val) {
          console.log(val);
          const locales = ["ar-AE", "en-US"];
          return locales.some((locale) =>
            validator.isAlpha(val, locale, { ignore: " " })
          );
        },
        message: " title must contain alpha only",
      },
  },
  category: { type: String,
    required: [true, "Product must have a category"],
    validate: {
      validator: function (val) {
        console.log(val);
        const locales = ["ar-AE", "en-US"];
        return locales.some((locale) =>
          validator.isAlpha(val, locale, { ignore: " " })
        );
      },
      message: " category must contain alpha only",
    },
  },
  description: { 
    type: String,
    maxlength: [150, "product description must be less than or equal to 150 characters"],
      validate: {
        validator: function (val) {
          console.log(val);
          const locales = ["ar-AE", "en-US"];
          return locales.some((locale) =>
            validator.isAlpha(val, locale, { ignore: " " })
          );
        },
        message: " title must contain alpha only",
      },
  },
  price: {
    type:Number,
    required: [true, "Product must have a price"],
    min: [0, "price must be greater than 0"],
    max: [10000, "price must be less than 10000"],
  },  
  discountPercentage: Number,
  rating: {
    type: Number,
    default: 0.0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  shippingInformation: String,
  tags: [String],
  brand: {
    type: String,
    // required: [true, "Product must have a brand"],
  },
  weight: Number,
  dimensions: Object,
  warrantyInformation: String,
  availabilityStatus: {
    type: String,
    required: [true, "Product must have availability status"],
  },
  returnPolicy: String,
  minimumOrderQuantity: Number,
  images: [String],
  thumbnail: {
    type: String,
    require: [true, "Product must have a thumbnail"],
  },
  orderDates: [Date],
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
  reviewId: [{
    type: mongoose.Schema.ObjectId,
    ref: "Review",
  }],
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true},
  timestamps:true
}
);
productSchema.virtual("priceAfterDiscount").get(function () {
  return this.price - (this.price * this.discountPercentage) / 100;
});

productSchema.virtual("slugify").get(function () {
  return slugify(this.title, { lower: true });
});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;