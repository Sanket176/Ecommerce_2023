import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

//Routes

//Create Category || POST
router.post('/create-category',requireSignIn, isAdmin, createCategoryController)

//Update Category || PUT
//also taking "id" here dynamically to update
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

//getAll Categories
router.get('/get-category', categoryController)

//Single Category
//get it with the help of slug
router.get('/single-category/:slug', singleCategoryController)

//Delete Category
router.delete('/delete-category/:id', requireSignIn, isAdmin,deleteCategoryController)

export default router;