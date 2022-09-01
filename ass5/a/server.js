const express= require("express");
const {userModel, postModel}=require("./schema")
const app=express();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
require("dotenv").config();
const salt=10;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.listen("3003", (err)=>{
    if(!err){
        console.log("server started at 3003")
    }
});
mongoose.connect("mongodb://localhost/assignment_5",()=>{
    console.log("connected to db");
},(err)=>{
    
})
app.post("/register", (req,res)=>{
    bcrypt.genSalt(salt,(err,hashSalt)=>{
        bcrypt.hash(req.body.password,hashSalt,(err,passwordHash)=>{
            userModel.create({name:req.body.name,email:req.body.email, password:passwordHash}).then(()=>{
                res.status(200).send("user added successfully");
            }).catch((err)=>{
                res.status(400).send(err)
            })
        })
    })
});
app.post("/login", (req,res)=>{
    userModel.find({email:req.body.email}).then((user)=>{
        if(user.length){
            bcrypt.compare(req.body.password,user[0].password).then((match)=>{
                if(match){
                    const authToken=jwt.sign(req.body.email, process.env.SECRET_KEY);
                    res.status(200).send({authToken});
                }else{
                    res.status(400).send("inavlid password");
                }
            });
        }else{
            res.status(400).send("user not exist")
        }
    })
});
app.post("/post",(req,res)=>{
    if(req.headers.authorization){
        try{
            const email=jwt.verify(req.headers.authorization,process.env.SECRET_KEY);
            postModel.create({body:req.body.body, image:req.body.image,title:req.body.title,user:email})
        }
        catch(err){
            res.status(403).send("user not authorized")
        }
    }
    else{
        res.status(400).send("missing authorization token")
    }
});
app.get("/post",(req,res)=>{
    if(req.headers.authorization){
        try{
            const email=jwt.verify(req.headers.authorization,process.env.SECRET_KEY);
            postModel.find({user:email}).then((posts)=>{
                res.status(200).send(posts);
            })
        }
        catch(err){
            res.status(403).send("user not authorized")
        }
    }
    else{
        res.status(400).send("missing authorization token")
    }
});
app.put("/post/:id", (req,res)=>{
    if(req.headers.authorization){
        postModel.find({_id: req.params.id}).then((post)=>{
            try{
            const email=jwt.verify(req.headers.authorization,process.env.SECRET_KEY);
            if(post[0].user===email){
                postModel.updateOne({_id:req.params.id},{}).then((posts)=>{
                    res.status(200).send("post updated successfully");
                });
             } else{
                    res.status(403).send("user not authorized cant change post")
                }
        }
        catch(err){
            res.status(403).send("user not authorized")
        }
    })
}});