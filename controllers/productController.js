import slugify from "slugify"
import productModel from "../modules/productModel.js"
import categoryModel from "../modules/categoryModel.js"
import orderModel from "../modules/orderModel.js"
import fs from 'fs'
import braintree from "braintree"
import dotenv from 'dotenv';

dotenv.config();

//Payment Gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//Create Product
export const createProductController= async(req, res) => {
    try {
        //will destructure/get values with thehelp of 'formidable'
        const {name,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files //for photos will use .files function
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case !photo && photo.size > 10000:
                return res.status(500).send({error:'Photo is required and should be less than 1 MB'})
        }
        console.log("After validation")
        const products = new productModel({...req.fields,slug: slugify(name)})//making a copy
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:'Product Created successfully',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating Product',
        })
    }
}

//get all products
export const getProductController = async (req,res) => {
    try {
        const products = await productModel
        .find({})
        .populate("category")//to display category's all info
        .select("-photo")//to remove photo
        .limit(30)//only 30(earlier was 12) item will b displayed
        .sort({createdAt:-1});//sorted order by created time
        res.status(200).send({
            success:true,
            total_no_of_item:products.length,
            message:'All Products displayed successfully',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting products',
        })
    }
}

//get single Product
export const getSingleProductController = async (req,res) => {
    try {
        const product = await productModel
        .findOne({slug:req.params.slug})
        .select("-photo")
        .populate("category");
        res.status(200).send({
            success:true,
            message:'Sigle Product fetched',
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting single product',
        })
    }
}


//get photo
export const productPhotoCoontroller = async (req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in getting photo of product',
        })
    }
}


//update a Product
export const updateProductController =async (req,res) => {
    try {
        const {name,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files //for photos will use .files function
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size > 10000:
                return res
                .status(500)
                .send({error:'Photo is required and should be less than 1 MB'})
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)}, {new:true}
            )
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message:'Product Updated successfully',
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating product',
        })
    }
}

//delete a product
export const deleteProductController = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while deleting product',
        })
    }
}

//filters
export const productFiltersController = async (req, res) => {
    try {
        //get both the filter i.e. (cateories via checked) and (prices by radio)
        const {checked, radio} =req.body
        let args ={};
        //wil check if only catgories filter is selected or only price is also selected or MULTIPLE filter selected
        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte: radio[0] , $lte: radio[1]}//i.e [0 to 19]
        const products =  await productModel.find(args);
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while Fltering Products',
            error,
        })
    }
}

//Product Count

export const productCountController = async (req,res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();//find all to count and use estimated function
        //counts the number of documents in the collection. 
        res.status(200).send({
            success:true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message:'Error in Product Count',
            success:false,
            error,
        })
    }
}

//Product list per page
export const productListController = async (req,res) =>{
    try {
        const perPage = 3;// 3 products will show per page
        const page = req.params.page ? req.params.page : 1
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1});
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message:'Error in Per page ctrl',
            success:false,
            error,
        })
    }
}

//search Product
export const searchProductController = async (req, res) => {
    try {
        const {keyword} = req.params;
        const result = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:'i'}},//check keyword in name and desc, case in-sensitive
                {description:{$regex: keyword, $options:'i'}}
            ]
        }).select("-photo")
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:'Error in Search Product API'
        })
    }
}


//Eg of callback function and above all function also
//Similar product (according to category)

export const relatedProductController = async(req,res) =>{
    try {
        const {pid,cid} = req.params;//get product id,category id from URL using req.params
        const products =await productModel.find({
            category:cid,
            _id:{$ne:pid},//will not include(ne) pid which is already selected
        }).select("-photo")//remove photo
        .limit(4)//apply limit
        .populate("category");//populate on category basis
        res.status(200).send({
            success:true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:'Error in getting similar products'
        })
    }
}

// get products by catgory
export const productCategoryController = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ slug: req.params.slug });
    // console.log(category)
      const products = await productModel.find({ category }).populate("category");
      res.status(200).send({
        success: true,
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Error While Getting products Category wise",
      });
    }
  };

  //payment gateway API
  //token
  export const braintreeTokenController = async (req, res) =>{
    try {
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err);
            }else{
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
  };

  //payment
  export const braintreePaymentController =async (req,res)=>{
    try {
        const {cart, nonce} = req.body;
        let total =0;
        cart?.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement:true,
            },
        },
        function(error, result){
            if(result){
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id,
                }).save();
                res.json({ok:true})
            }else{
                res.status(500).send(error);
            }
        }
        );
    } catch (error) {
        console.log(error)
    }
  }