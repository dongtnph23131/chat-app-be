const express=require('express')
const { searchUser } = require('../controllers/user')

const router=express.Router()

router.get('/search/user',searchUser)

module.exports=router