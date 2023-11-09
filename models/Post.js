const mongoose=require('mongoose')
const { Schema,ObjectId } = mongoose;
const postSchema =new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"no photo"
    },
    postedBy:{
        type:ObjectId,
        ref:"user"
    }

})

mongoose.model("Post",postSchema)