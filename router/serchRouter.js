const express = require("express");
const searchRouter = express.Router();
const { PostModel } = require('../model/postModel');
require('dotenv').config();


searchRouter.get("/", async (req, res) => {
    let perPage = 12;
    let page = parseInt(req.query.page) || 0;
    let q = req.query.q || "";
    
    try {
      PostModel.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: new RegExp(`${q}`, `i`) } },
            ],
          },
        },
        {
          $facet: {
            data: [
              { $skip: page * perPage },
              { $limit: perPage },
            ],
            count: [
              { $count: "total" },
            ],
          },
        },
      ])
        .then((result) => {
          let data = result[0].data;
          let count = result[0].count[0].total;
          res.send({
            message: "Query successful",
            status: 1,
            data: data,
            count: count,
            error: false,
          });
        })
        .catch((error) => {
          res.send({
            message: "Something went wrong" + error,
            status: 0,
            error: true,
          });
        });
    } catch (error) {
      res.send({
        message: "Something went wrong" + error.message,
        status: 0,
        error: true,
      });
    }
    
  
});

searchRouter.get('/item',(req,res)=>{
    res.send([])
})

searchRouter.get('/item/:key',async(req,res)=>{

  let data = await PostModel.find(
    {
      "$or":[
        {title:{$regex:new RegExp(`${req.params.key}`, `i`)}}
      ]
    }
  )
  res.send(data)
})

module.exports = {
    searchRouter
}