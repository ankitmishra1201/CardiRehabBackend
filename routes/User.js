const user_Act=require("../controllers/User.js")
const express=require("express");

const router=express.Router()

router.post('/registeruser',user_Act.registerUser)
router.post('/loginuser',user_Act.loginUser)
router.get('/getalluser',user_Act.getallusers)
router.get('/getuser/:id',user_Act.getpaticularuser)

router.post('/:id/addhealthdata',user_Act.addhealth_data)


module.exports=router