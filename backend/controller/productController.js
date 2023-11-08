const { append } = require("express/lib/response");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")


//CREATE PRODUCTS --ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    console.log(req.body);
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })


})


//GET ALL PRODUCTS --ADMIN
exports.getAllproducts = catchAsyncErrors(async (req, res) => {
    
    var { name, category, max, min, page, limit } = req.query
    
    const queryObj = {}


    if (name) {
        queryObj.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        queryObj.category = category;
    }
    if (!max) {
        max = 999999;
    }
    if (!min) {
        min = 0;
    }
    if (max || min) {
        queryObj.price = { $gt: min, $lt: max }
    }

    console.log(queryObj);
    let startIndex = 0;
    let endIndex = 50;
    if (page && limit) {
        startIndex = (page - 1) * limit
        endIndex = page * limit
    }
    // console.log(startIndex);
    // console.log(endIndex);

    const products = await Product.find(queryObj);
   
    const data = products.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        data,
        length:products.length
    });




})

//GET PRODUCT DETAILS
exports.getProductDetails = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};


//UPDATE PRODUCTS --ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));

    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true,
        product
    })
})



//DELETE PRODUCTS --ADMIN
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));

    }

    product = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "product deleted succesfully",
        product
    })
}
)