const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const { PostModel } = require('../model/postModel');
require('dotenv').config();

postRouter.get('/allPosts', (req, res) => {
    let token = req.headers.tkn
    let page = req.query.page || 0
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (err) res.send({
            message: "user not authenticated",
            status: 0,
            error: true
        })
        try {
            let count = await PostModel.find().countDocuments();
            let data = await PostModel.find();
            res.send({
                message: "All cart data",
                status: 1,
                count: count,
                data: data,
                error: false
            })
        } catch (e) {
            res.send({
                message: "error: " + e,
                status: 0,
                error: true
            })
        }
    });
})

postRouter.get('/', (req, res) => {
    let token = req.headers.tkn
    let page = req.query.page || 0
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (err) res.send({
            message: "user not authenticated",
            status: 0,
            error: true
        })
        try {
            let count = await PostModel.find({user}).countDocuments();
            let data = await PostModel.find({user});
            res.send({
                message: "All cart data",
                status: 1,
                count: count,
                data: data,
                error: false
            })
        } catch (e) {
            res.send({
                message: "error: " + e,
                status: 0,
                error: true
            })
        }
    });
})

postRouter.get('/:pid', (req, res) => {
    let token = req.headers.tkn;
    let { pid } = req.params;
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (err) res.send({
            message: "err: " + err,
            status: 0,
            error: true
        })
        let { userId: user } = decoded
        //console.log('set',user,pid)
        try {
            let data = await PostModel.find({ user, _id: pid })
            if (data.length > 0) {
                res.send({
                    message: "Item already in cart",
                    status: 1,
                    data:data,
                    error: false
                })
            } else {
                res.send({
                    message: "Item not present in cart",
                    status: 0,
                    error: true
                })
            }
        } catch (e) {
            res.send({
                message: "error: " + e,
                status: 0,
                error: true
            })
        }
    })
})

postRouter.patch('/:id', async (req, res) => {
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
            await PostModel.updateOne({ _id, user }, req.body)
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

postRouter.delete('/:id', async (req, res) => {
    let { id: _id } = req.params
    let token = req.headers.tkn
    jwt.verify(token, process.env.key, async (err, decoded) => {
        if (err) res.send({
            message: "err: " + err,
            status: 0,
            error: true
        })
        try {
            let { userId: user } = decoded
            await PostModel.deleteOne({ _id, user })
            res.send({
                message: "err: " + err,
                status: 1,
                error: false
            })
        } catch (err) {
            res.send({
                message: "err: " + err,
                status: 0,
                error: true
            })
        }
    })
})

postRouter.post("/add", async(req, res) => {

    try {
        //console.log(req.body)
        await PostModel.insertMany(req.body);
        res.send({
            message: "Item added in cart",
            status: 1,
            error: false,
        });
    } catch (error) {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
    }
});

module.exports = {
    postRouter
}