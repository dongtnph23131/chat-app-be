const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const chatRouter = require('./routers/chat')
const messageRouter = require('./routers/message')
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', chatRouter)
app.use('/api', messageRouter)
const server = require('http').createServer(app)
const serverApp = server.listen(process.env.PORT, async () => {
    await mongoose.connect('mongodb+srv://donghaha:123456abc@ecommerce.ylijltl.mongodb.net/chat-app?retryWrites=true', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Ok');
    })
})
const io = require('socket.io')(serverApp, {
    pingTimeout: 60000,
    cors: {
        origin: 'https://chat-app-self-six.vercel.app'
    }
});

io.on('connection', (socket) => {
    // Đăng ký bộ xử lý cho sự kiện
    socket.on('setup', (userData) => {
        //Tạo 1 phòng cho người dùng
        socket.join(userData._id)
        // Xử lý tin nhắn và có thể gửi lại cho tất cả các clients khác
        socket.emit('connected')
    })
    //Tham gia phòng của bộ sự kiện ''join chat
    socket.on('join chat', (room) => {
        socket.join(room)
    })
    socket.on('new message', (newMessage) => {
        console.log(newMessage);
        let chat = newMessage.chat
        if (!chat.users) return console.log('Chat.user is not defined');
        chat.users.forEach(user => {
            if (user._id == newMessage.sender._id) return
            // Gửi tin nhắn đến tất cả các thành viên trong phòng 'chatroom'
            socket.in(user._id).emit('message recieved', newMessage)
        });
    })

});
