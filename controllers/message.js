const Chat = require('../models/chat')
const Message = require('../models/message')
const User = require('../models/user')
exports.sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        }
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name avatar email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        return res.status(200).json(message)
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.getAllMessage = async (req, res) => {
    console.log(req.params.id);
    try {
       const messages=await Message.find({chat:req.params.id}).populate("sender", "name avatar email")
       .populate("chat");

       return res.status(200).json(messages)
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}