import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoute from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import cors from 'cors'
import path from 'path'//use path for locating the build folder to deploy webapp
//const and require - common js format
//import from - module(ES6)(as React) format

//configure env
dotenv.config();

//database config
connectDB();

//rest object
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './client/build')))

//Routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category',categoryRoute)
app.use('/api/v1/product',productRoute)


//rest api
app.use('*', function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//rest api (before build)
app.get('/', (req,res)=>{
    res.send("<h1>Welcome to Ecommerce Website in MERN</h1>")
})

//PORT
const PORT = process.env.PORT || 8080

//run listen
app.listen(PORT, ()=>{
    console.log(`Server running on ${process.env.DEV_MODE} mode on the port ${PORT}`.bgCyan);
})