const { default: mongoose } = require('mongoose');
const mongoUrl="mongodb+srv://curiousvidushi27:Veenukush@cluster0.7pxsnem.mongodb.net/?retryWrites=true&w=majority";
// const mongoUrl ="mongodb+srv://curiousvidushi27:Veenukush@cluster0.pa9g6yx.mongodb.net/?retryWrites=true&w=majority"
 
const connectToMongo=()=>{
    mongoose.connect(mongoUrl);
    console.log("connected to mongoDb Successfully for Alumni Network");
}
module.exports =connectToMongo;