const User=require('../models/user.js')
const bcrypt=require('bcryptjs')




const registerUser= async (req,res,next) => {
    const{name,password,role,code_no}= req.body;
    
    bcrypt.hash(password,10).then(async(hash) => {
        await User.create({
            code_no:code_no,
            name:name,
            password:hash,
            role:role,
            health_report:[],
            
           


    }).then(user => 
            res.status(200).json({
                message:"User created successfully",
                user:user,
            })
        )
        
    .catch((error)=>
        res.status(400).json({
            message:error.message
        })
    
        )
        
    });
    
    }


    const loginUser= async (req,res,next) => {
        const{code_no,password}= req.body;
        if(!code_no||!password){
            return res.status(400).json({message:"Code or password not present"});
        }
        try{
            const user=await User.findOne({code_no:code_no});
            if(!user){
                res.status(400).json({
                    message:"Login not successful",
                    error:"User not found"
                })
            }else{
                bcrypt.compare(password,user.password).then(function (result) {
                    result?
                    res.status(200).json(user):
                    res.status(400).json({
                        message:"Login not successful",
                    });
                });
            }
        }catch(error){
            res.status(400).json({
                message:"An error occured",
                error:error.message
            })
        }
        }

        const getallusers= async (req,res,next) => {
            try{
                const users=await User.find({'role':'normal'});
                res.status(200).json(users);
            }catch(error){
                res.status(400).json(error);
            }
        }

        const getpaticularuser= async (req,res,next) => {
            const{id}= req.params;
            try{
                const user=await User.findById(id);
                res.status(200).json({
                    message:"User fetched successfully",
                    user:user,
                })
            }catch(error){
                res.status(400).json({
                    message:"An error occured",
                    error:error.message
                })
            }
        }

        const addhealth_data= async (req,res,next) => {
            const{id}=req.params;
            const{datetime,question1,question2,question3,question4,question3_reason,question4_reason,question5,question6,question7,question6_reason,question7_reason}=req.body;
            try{
                const user=await User.findById(id);
                user.health_report.push({
                    datetime:datetime,
                    question1:question1,
                    question2:question2,
                    question3:question3,
                    question4:question4,
                    question5:question5,
                    question6:question6,
                    question7:question7,
                    question3_reason:question3_reason,
                    question4_reason:question4_reason,
                    question6_reason:question6_reason,
                    question7_reason:question7_reason
                });
                await user.save();
                res.status(200).json({
                    message:"HealthData added successfully",
                    healthdata:user.health_report,
                })
            }catch(error){
                res.status(400).json({
                    message:"An error occured",
                    error:error.message
                })
                console.log(error);
            }
        }
        const deleteUser=async(req,res)=>{
            const{id}=req.params;
            try{
            await User.findByIdAndDelete(id)
            res.status(200).json({
                message:"Successfully deleted"
            })
            }catch(error){
                console.log(error)
            }
        }


        const updateuser=async(req,res)=>{
            const{id}=req.params;
            const{name,emailid,phone,ip_no,op_no,DO_admission,DO_surgery,DO_followup}=req.body
            try{
                const user=await User.findByIdAndUpdate(id,{
                    name:name,
                    emailid:emailid,
                    phone:phone,
                    ip_no:ip_no,
                    op_no:op_no,
                    DO_admission:DO_admission,
                    DO_surgery:DO_surgery,
                    DO_followup:DO_followup


                })
                
                res.status(200).json({
                    message:"User Updated Successfully",
                    user:user
                })
                
            }catch(error){

            }
        }

    
module.exports.registerUser=registerUser
module.exports.loginUser=loginUser
module.exports.getallusers=getallusers
module.exports.getpaticularuser=getpaticularuser
module.exports.deleteUser=deleteUser
module.exports.updateuser=updateuser


module.exports.addhealth_data=addhealth_data



