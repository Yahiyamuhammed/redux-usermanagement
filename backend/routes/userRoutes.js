const express =require('express')
const { createUser, userLogin, updateUser, uploadProfile, verifyToken, getUser } = require('../controler/userControler')
const router=express.Router()

console.log('enterd route');


router.post('/createUser',createUser)
router.post('/login',userLogin)
router.put('/updateUser/:id',verifyToken,updateUser)
router.post('/uploadProfile/:id',verifyToken,uploadProfile)
router.get('/getUser',getUser)

module.exports=router