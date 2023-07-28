const express = require('express');
require('dotenv').config();
const {connection}= require('./config/db')
const {userRouter} = require('./router/userRouter')
const {postRouter} = require('./router/postRouter')
const {searchRouter} = require('./router/serchRouter');
const {authenticate} = require('./middleware/authenticate');
const cors = require('cors');
const app = express();


app.use(cors({
    origin:"*"
}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('welcome to purplle')
});


app.use('/users',userRouter)
app.use(authenticate);
app.use("/post",postRouter)
app.use("/search",searchRouter)
// app.use("/cart",cartRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("Server is running on port number",process.env.port)
})