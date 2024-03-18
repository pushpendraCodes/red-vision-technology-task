const { Cart } = require('../models/Cart');

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.params
console.log("wori" ,id)
  try {
    const cartItems = await Cart.find({ user: id }).populate('book');
    console.log(cartItems,"itescart")
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {

  const cart = new Cart(req.body)
  try {
    const doc = await cart.save();
    const result = await doc.populate('product');
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('book');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};