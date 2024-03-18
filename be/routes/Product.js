const express = require("express");
const {
  createProduct,
  fetchProduct,
  filterProduct,
  fetchProductById,
  updateProduct,
} = require("../controllers/Product");
const router = express.Router();

router
  .post("/", createProduct)
  .get("/", filterProduct)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct)
  .get("/fetchBooks", fetchProduct)

exports.router = router;
