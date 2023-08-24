const express = require('express');
const { getAllproducts,createProduct,updateProduct,deleteProduct, getProductDetails } = require('../controller/productController');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/products', getAllproducts);
router.route('/product/new').post(createProduct);
router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProductDetails);

module.exports = router

