const express =require('express')
const { viewUsers, adminLogin, userSearch, adminCreateUser, adminUpdateUser, deleteUser, verifyAdminToken } = require('../controler/adminController')


const router=express.Router()

router.get('/viewUser',verifyAdminToken,viewUsers)
router.post('/adminLogin',adminLogin)
router.post('/userSearch',verifyAdminToken,userSearch)
router.post('/adminCreateUser',verifyAdminToken,adminCreateUser)
router.put('/adminUpdateUser/:id',verifyAdminToken,adminUpdateUser)
router.delete('/adminDeleteUser/:id',verifyAdminToken,deleteUser)

module.exports=router