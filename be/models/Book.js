const mongoose = require("mongoose");

const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    year: { type: Number, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, min: [1, "wrong min price"] },
    discountPercentage: {
      type: Number,
      min: [0, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max price"],
      default: 0,
    },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },

    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// to chnage _id to id for frontend
const virtual = BookSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
BookSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Books = mongoose.model("Book", BookSchema);
// productSchema
// Product
