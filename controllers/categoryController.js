import categoryModel from "../modules/categoryModel.js";
import slugify from 'slugify';


//To create Category
export const createCategoryController = async (req,res) =>{
    try {
        const {name} = req.body;//getting name from the response
        if(!name){
            return res.status(401).send({message:'Name is required'})
        }
        //will check if the category which we are trying to create is already present or not
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category Already Exists'
            })
        }
        //if not already exists, then will create and save it
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:'new Category created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
}

//To Update Category
export const updateCategoryController= async (req,res) => {
    try {
        //get the name to be update
        const {name} = req.body
        //update with the help of "id"// "id" will come from url i.e. params
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name,slug:slugify(name)}, 
            {new:true}
        );
        res.status(200).send({
            success:true,
            message:'Category updated successfully',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating the category',        
        })
    }
}

//getAll Category
export const categoryController= async (req,res)=>{
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:'All Category list',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting all categories',
        })
    }
}

//single category
export const singleCategoryController = async (req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:'Get Single Category successfully',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting Single category',
        })
    }
}

//delete category
export const deleteCategoryController = async (req,res)=>{
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'Deleted a Category successfully',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while deleting a category',
        })
    }
}