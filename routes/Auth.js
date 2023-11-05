const express = require('express');
const User =require('../models/User');
const router =express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Wonderful@Day';

// ROUTE 1 :Create a User using:POST "api/auth/createuser " .Doesn't require Auth -No login required
router.post('/createuser',[
       body('name','Enter a valid name').isLength({min:3}),
       body('email','Enter a valid email').isEmail(),
       body('password','Enter a valid Password').isLength({min:5}),
],async (req,res)=>{
       let success=false;

       //if there are errors , return bad request and the errors
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       //Check whether with this email exists already
       try {
              
       
       let user = await User.findOne({email: req.body.email});
       if(user){
              return res.status(400).json({success,error:"Sorry a user with this email already exists "})
       }
       const salt = await bcrypt.genSalt(10);
       const secPass= await bcrypt.hash(req.body.password,salt) ; 
       //Create a new User
       user = await User.create({
              name: req.body.name,
              password: secPass,
              email: req.body.email,
            })
            
         const data={
              user:{
                     id: user.id
              }
              
         }    
         const autoken= jwt.sign(data ,JWT_SECRET);
        success=true;
         res.json({success,autoken});
           // res.send(req.body);
              // res.json({user})
              } catch (error) {
              console.error(error.message)
              res.status(500).send("Internal Server error occured ")
       } 

       })

    

// ROUTE 2: Authenticate a User using:POST "api/auth/login " . -No login required
router.post('/login',[
       body('email','Enter a valid email').isEmail(),
       body('password',' Password cannot be blank').exists(),
],async (req,res)=>{
 //if there are errors , return bad request and the errors
 let success=false;
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }

 const {email,password}=req.body;
 try {
       
   let user= await User.findOne({email});
   if(!user){
       success=false;
       return res.status(400).json({success,error:"Please try to login again with correct credentials"});

   }
   const passwordCompare = await bcrypt.compare(password,user.password);
 if(!passwordCompare){
       success=false;
       return res.status(400).json({success, error:"Please try to login again with correct credentials"});

 }
 const data={
       user:{
              id: user.id
       }
       
  }    
  const autoken= jwt.sign(data ,JWT_SECRET);
 success =true;
  res.json({success,autoken});

 } 
 catch (error) {
       console.error(error.message)
       res.status(500).send("Internal Server error occured ")
       } 
}
)

// ROUTE 3: Get LoginUser detail using:POST "api/auth/getuser " . - login required
router.post('/getuser',fetchuser, async (req,res)=>{  
try {
       userId =req.user.id;
       const user = await User.findById(userId).select("-password")
       res.send(user); 
} catch (error) {
       {
              console.error(error.message)
              res.status(500).send("Internal Server error occured ")
              }  
  }
})
module.exports = router