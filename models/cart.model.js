const { default: mongoose } = require("mongoose");


const cartSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
         {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
           // required: true,
        },
        //quantity: {
        //    type: Number,
        //    required: true,
        //},
    ], 
    title : {
        type: String,
    },
    totalPrice: {
        type: Number,
    }
});

module.exports = new mongoose.model("Cart", cartSchema)