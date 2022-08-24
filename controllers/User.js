const User=require('../models/user.js')
const bcrypt=require('bcryptjs')


const registerUser= async (req,res,next) => {
    const{name,password,role,emailid,phone}= req.body;
    if(password.length<6){
        return res.status(400).json({message:"Password must be atleast 6 characters long"});
    }
    bcrypt.hash(password,10).then(async(hash) => {
        await User.create({
            name:name,
            password:hash,
            role:role,
            emailid:emailid,
            phone:phone,
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
        const{emailid,password}= req.body;
        if(!emailid||!password){
            return res.status(400).json({message:"emailid or password not present"});
        }
        try{
            const user=await User.findOne({emailid:emailid});
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
                const users=await User.find();
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
            const{datetime,question1,question2,question3,question4,question3_reason,question4_reason}=req.body;
            try{
                const user=await User.findById(id);
                user.health_report.push({
                    datetime:datetime,
                    question1:question1,
                    question2:question2,
                    question3:question3,
                    question4:question4,
                    question3_reason:question3_reason,
                    question4_reason:question4_reason,
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
    
module.exports.registerUser=registerUser
module.exports.loginUser=loginUser
module.exports.getallusers=getallusers
module.exports.getpaticularuser=getpaticularuser


module.exports.addhealth_data=addhealth_data