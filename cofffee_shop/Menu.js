import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
  description: String,
  image: String,
});

export default mongoose.model("Menu", menuSchema, "Menu");
