require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const session = require('express-session')
const db = require("./Models/db")
const UserControllers = require('./Controllers/UserControllers')

app.set("view engine","ejs")

app.use(express.static('./public'))
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Print All Requests middleware
app.use("/",(req,res,next)=>{
    console.log("Path=>",req.path)
    console.log("Method=>",req.method);
    console.log("Body=>",req.body);
    next();
})
//middleware-end

//check login middleware
function checkLoggedIn(req, res, next) {
    const publicRoutes = ['/login', '/signup'];
    if (!req.session.isLoggedIn && !publicRoutes.includes(req.path)) {
        return res.redirect("/login");
    }
    next();
}

//middleware-end

const UserRoutes = require('./Routes/userRoutes')
app.use("/",checkLoggedIn,UserRoutes);

db.init()
.then(()=>{
    console.log("Db connected");
    app.listen(process.env.PORT||8000,()=>{
        console.log("Server is running on Port 8000");
    })
})
.catch(err=>console.log(err))