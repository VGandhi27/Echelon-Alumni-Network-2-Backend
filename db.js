const { default: mongoose } = require('mongoose');
const mongoUrl="mongodb://localhost:27017/Alumni_Network";

const connectToMongo=()=>{
    mongoose.connect(mongoUrl);
    console.log("connected to mongoDb Successfully for Alumni Network");
}
module.exports =connectToMongo;