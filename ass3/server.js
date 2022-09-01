const express= require("express");
const ejs=require("ejs");
const app=express();
const users=[];
app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.listen(3000, (err,res)=>{
    if(!err){
        console.log("server started")
    }else{
        console.log(err)
    }
})
app.get("/",(req,res)=>{
    res.render("dummy-user", {users})
})
app.get("/form", (req,res)=>{
    res.render("form");
})
app.post("/user/add", (req,res)=>{
    users.push(req.body) 
    res.redirect("/")
})
 