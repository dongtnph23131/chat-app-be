const Chat = require('../models/chat');
const User = require('../models/user');

exports.accsessChat = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: 'Không thấy userId'
            })
        }
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate('users', "-password").populate('latestMessage')
        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'name avatar email'
        })
        if (isChat.length > 0) {
            return res.status(200).json(isChat[0]);
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
        }
        const createdChat = await Chat.create(chatData);
        console.log(createdChat);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );
        console.log(FullChat);
        return res.status(200).json(FullChat);
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updateAt: -1 }).then(async (result) => {
            result = await User.populate(result, {
                path: 'latestMessage.sender',
                select: 'name avatar email'
            })
            return res.status(200).json(result)
        })
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.createGroupChat = async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({
                message: 'Không thấy user hoặc tên group chat'
            })
        }
        const users = req.body.users
        if (users.length < 2) {
            return res.status(400).json({
                message: 'Cần nhiều hơn 2 người tạo group chat'
            })
        }
        users.push(req.user)
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

        return res.status(200).json(fullGroupChat)
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.renameGroup = async (req, res) => {
    try {
        const { chatId, chatName } = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName: chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        return res.status(200).json({
            message: 'Đổi tên thành công',
            updatedChat
        })

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {
                    users: userId
                }
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        return res.status(200).json(removed)

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
exports.addToFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    users: userId
                }
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        return res.status(200).json(removed)

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
