import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[{//array of object
        type: mongoose.ObjectId,
        ref: 'Products',
    },],
    payment:{//object
    },
    buyer:{
        type: mongoose.ObjectId,
        ref: 'users',
    },
    status:{
        type:String,
        default: 'Not Process',
        enum:['Not Process', 'Processing', 'Shipped','Delivered', 'Cancel']
    }
},{timestamps: true});

export default mongoose.model('Order',orderSchema);