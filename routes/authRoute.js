import express from 'express';
import { registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController
} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';


//router object
const router = express.Router()

//**routing**//

//REGISTER || METHODE POST
router.post('/register',registerController)
//note: after '/register' it should get a callback function, but since we are following MVC pattern
//We will create separate controller i.e. registerController(here) in file authController.js

//LOGIN || METHODE POST
router.post('/login', loginController)

//Fogot Password || POST
router.post('/forgot-password', forgotPasswordController)

//test route
router.get('/test', requireSignIn, isAdmin, testController)
//adding middleware i.e requireSignIn in middle, after that it will take JWT token
//and then only it will show protected routes or it will not show in case of wrong JWT token
//isAdmin is another middleware to check if the user is admin or not

//Private User route auth
//any request comes here, if its true then only it will show the private route(eg. Dasboard)
router.get('/user-auth',requireSignIn, (req,res) => {
    res.status(200).send({ok:true});
})

//Private Admin route
router.get('/admin-auth',requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ok:true});
})

//update user profile
router.put('/profile',requireSignIn, updateProfileController);

//orders (User)
router.get('/orders', requireSignIn, getOrdersController)

//All orders (Admin)
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

export default router; 