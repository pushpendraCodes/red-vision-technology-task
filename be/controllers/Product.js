const {Books}  = require("../models/Book")

// add product
exports.createProduct = async (req, res) => {
  const product = await new Books(req.body);
  try {
    let resp = await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};

// fetch All product
exports.fetchProduct = async (req, res) => {
  try {
    const books = await Books.find()
    console.log(books,"all books")
    res.status(200).json(books);
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};

// sort filtering and  pagination
exports.filterProduct = async (req, res) => {
  let query = Books.find({});
  let totalProductsQuery = Books.find({});
  // console.log(query,"query")
  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.author) {
    query = query.find({ author: req.query.author });
    totalProductsQuery = totalProductsQuery.find({ author: req.query.author });
  }
  //TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query.search) {
    query=query.find({
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ],
    });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  // console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    console.log(docs,"dosc")
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

// fetch product by id
exports.fetchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Books.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};

// updateProductby id

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Books.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(401).json(error);
    console.log(error);
  }
};
