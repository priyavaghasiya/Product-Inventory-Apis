import mongoose from "mongoose";
import categorySchema from "./category.model.js";

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    unique: true,
    required: true,
  },
  category_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: categorySchema,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const product = mongoose.model("product", productSchema);

export default product;
