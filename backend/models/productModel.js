const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    size: String,
    category: String,
    stock: Number
})

module.exports = mongoose.model("Product",productSchema);