const express = require('express');
const mongoose = require('mongoose');

const app=express();


//MONGOOSE CONNECTION
const url= "mongodb+srv://admin:tVj1ks0bdNLDyRHd@cluster0.bmcjgtb.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url,{useNewUrlParser:true});
const con=mongoose.connection;


app.use(express.json());
try{
    con.on('open',()=>{
        console.log('Connected')
    })
}catch(err){
    console.log("Error: "+err)
}







app.get('/',(req,res)=>{
    res.send("Server is running successful")
})

const userrouter=require("./routes/User.js");
app.use('/user',userrouter)


//SERVER CONNECTION
app.listen(process.env.PORT||8000,() =>{
    console.log('Server started on port ');
})

