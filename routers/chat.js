const express=require('express')
const { authenticate } = require('../middlewares/authenticate')
const { accsessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToFromGroup } = require('../controllers/chat')

const router=express.Router()

router.post('/accessChat',authenticate,accsessChat)
router.get('/accessChat',authenticate,fetchChats)
router.route("/group").post(authenticate, createGroupChat);
router.route("/rename").patch(authenticate, renameGroup);
router.route("/group/remove").patch(authenticate, removeFromGroup);
router.route("/group/add").patch(authenticate, addToFromGroup);

module.exports=router