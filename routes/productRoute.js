import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    productPhotoCoontroller,
    relatedProductController,
    searchProductController,
    updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(),createProductController)

//get products
router.get('/get-product', getProductController)

//get single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoCoontroller)

//update product || PUT
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//filter product
router.post('/product-filters', productFiltersController)

//count product
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)


//search product
router.get('/search/:keyword', searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise products
router.get('/product-category/:slug', productCategoryController)


//payments routes
//token from Braintree only to get our account verified
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router;