const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
exports.signup = async (req, res) => {
    try {
        const { email, password, name,avatar } = req.body
        console.log(avatar);
        const userExits = await User.findOne({ email: email })
        if (userExits) {
            return res.status(400).json({
                message: "Email đã được đăng ký"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashPassword,avatar:avatar
        })
        user.password = undefined

        return res.status(200).json({
            message: "Đăng ký thành công",
            user
        })
    }
    catch (error) {
        res.status(400).json({
            message: "Đăng ký thất bại",
            error: error.message
        })
    }
}
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                message: "Tài khoản không tồn tại"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không đúng"
            })
        }
        const token = jwt.sign({ id: user._id }, "dongtimo", {
            expiresIn: '1d'
        })
        user.password = undefined
        return res.status(200).json({
            message: "Đăng nhập thành công",
            user,
            token
        })
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}