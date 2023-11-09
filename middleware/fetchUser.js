var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Wonderful@Day';
const mongoose = require('mongoose')
const User =require('../models/User');
const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    // const token = req.header('auth-token');
    // if (!token) {
    //     res.status(401).send({ error: "Please authenticate using a valid token" })
    // }
    // try {
    //     const data = jwt.verify(token, JWT_SECRET);
    //     req.user = data.user;
    //     next();
    // } catch (error) {
    //     res.status(401).send({ error: "Please authenticate using a valid token" })
    // }
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
        
    })
}


module.exports = fetchuser;