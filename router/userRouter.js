const express = require("express");
const userRouter = express.Router();
const {UserModel} = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

userRouter.get('/',async(req,res)=>{
    let data = await UserModel.find();
    res.send(data)
})

userRouter.post("/register",async(req,res)=>{
    const {name, email, password,number,username,location} = req.body;
    //console.log(req.body)
    try{
        bcrypt.hash(password, 3 , async(err, hash)=>{
            if(err){
                console.log(err)
                res.send('something went wrong while hashing')
            }else{
                const user = new UserModel({name,email,password:hash,number,username,location})
                await user.save();
                res.send(req.body)
            }
        })
    }catch(e){
        res.send(e.message)
    }
});

userRouter.post("/login", async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await UserModel.find({email});
        const token = jwt.sign({userId : user[0]._id},process.env.key);
        if(user.length){
            bcrypt.compare(password,user[0].password , function(err,result){
                if(result){
                    res.send({"msg":"logged in",token,"user":user[0]})
                }else{
                    res.send("password mismatched")
                }
            })
        }else{
            res.send("user not found")
        }
    }catch(e){
        res.send(e)
    }
})

userRouter.patch('/:id', async(req,res)=>{
    let { id: _id } = req.params
    let token = req.headers.tkn;
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (err) res.send({
            message: "err: " + err,
            status: 0,
            error: true
        })
        try {
            let { userId: user } = decoded
            console.log('quantity', req.body, _id, user)
            await CartModel.updateOne({ _id, user }, req.body)
            res.send({
                message: "Item updated",
                status: 1,
                error: false
            })
        } catch (err) {
            res.send({
                message: 'err: ' + err,
                status: 0,
                err: true
            })
        }
    })
})


module.exports={
    userRouter
}