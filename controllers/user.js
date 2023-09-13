const User = require('../models/user')
exports.searchUser = async (req, res) => {
    try {
        const search = req.query.search
        const data = await User.find(
            { name: { $regex: search, $options: 'i' } }
        )
        return res.status(200).json({
            data: data
        })
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}