const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const chatRouter=require('./routers/chat')
const messageRouter=require('./routers/message')
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api',chatRouter)
app.use('/api',messageRouter)
const server = require('http').createServer(app)
//
const io = require('socket.io')(server);
io.on('connection', () => {

});
server.listen(process.env.PORT, async () => {
    await mongoose.connect('mongodb+srv://donghaha:123456abc@ecommerce.ylijltl.mongodb.net/chat-app?retryWrites=true', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Ok');
    })
})