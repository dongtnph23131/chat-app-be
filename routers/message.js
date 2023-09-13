const express=require('express')
const { authenticate } = require('../middlewares/authenticate')
const { sendMessage, getAllMessage } = require('../controllers/message')

const router=express.Router()

router.post('/sendMessage',authenticate,sendMessage)
router.get('/sendMessage/:id',authenticate,getAllMessage)
module.exports=router