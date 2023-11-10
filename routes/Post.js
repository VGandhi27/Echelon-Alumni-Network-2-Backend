const express =require('express');
const router =express.Router();
const mongoose=require('mongoose');
const requireLogin=require("../middleware/fetchUser");
// const Post =mongoose.model("Post");
const Post =require('../models/Post');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get("/getsubpost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

// router.post("/createpost",requireLogin,(req,res)=>{

//     const {title,body,pic  }=req.body
//     if(!title ||!body||!pic){
//         return res.status(422).json({error:"Please add all the fields"})
//     }
//        req.user.password=undefined
//     const post=new Post({
//         title,
//         body,
//         photo:pic,
//         postedBy:req.user
//     })
//     post.save().then(result=>{
//         res.json({post:result})

//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })

router.post("/createpost", requireLogin, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('body', 'Body must be at least 5 characters').isLength({ min: 5 }),
    body('pic', 'Enter a valid pic URL').isURL(),
], async (req, res) => {
    try {
        const { title, body, pic } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Post({
            title,
            body,
            photo: pic,
            postedBy: req.user.id
        });

        const savedPost = await post.save();

        res.json({ post: savedPost });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/addnotedfff', requireLogin, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {

            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })


router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.put('/like',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
      $push:{likes:req.user._id}
  },{
      new:true
  }).exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
})

router.put('/unlike',requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
      $pull:{likes:req.user._id}
  },{
      new:true
  }).exec((err,result)=>{
      if(err){
          return res.status(422).json({error:err})
      }else{
          res.json(result)
      }
  })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports =router