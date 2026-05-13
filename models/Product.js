const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] },
    favoriteCount: { type: Number, default: 0 },
  },
  { timestamps: true }, // createdAt, updatedAt 자동 생성
);

module.exports = mongoose.model("Product", productSchema);
