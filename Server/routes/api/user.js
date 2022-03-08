const express = require("express");
const { User, validate} = require("../../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const debug = require("debug")("app:routes");
const {join, basename} = require("path");
const {moveFile, deleteFile} = require("../../utilities/fileManager");
const {uploadImage, fileUploadPaths,} = require("../../middleware/uploadHandler");

// @route GET api/user/me
// @desc user info
// @access private
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id)
    res.json(
        _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "email",
            'picture',
            "Rank",
            "password",
            "Credit",
        ])
    );
});


// @route GET api/user/all
// @desc users info
// @access private
router.get("/all", auth, async (req, res) => {
    const users = await User.find().select("-password");
    if(!users) res.status(400).json({message: "Empty List"});
    
    return res.status(200).json(users);

})
// @route Get api/user/:_id
// @desc get user by id
// @access public
router.get("/userId=:_id",  async (req, res) => {
    console.log(req.params._id);
    const user = await User.findById(req.params._id).select("-password")
    res.json(
        _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "email",
            'picture',
            "Rank",
            "Credit",
        ])
    );
    
});
// @route POST api/user
// @desc register user
// @access Private
router.post("/add_user", auth,async (req, res) =>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const {email, password} = req.body;

    //Checking if email does already exist
    let user = await User.findOne({email});
    if(user) return res.status(400).json({message: "User already exist"});

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    Rank2 = req.body.Rank;
    user = new User({
        ...req.body,
        password:hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email : req.body.email,
        Rank : Rank2,
        Credit:150,
    });

    user = await user.save();

    const token = user.generateAuthToken();
    res.status(200).json({
        token,
        user: _.pick(user, [
            "_id",
            "firstName",
            "lastName",
            "email",
            "password",
            "Rank",
            "Credit",
        ]),
    });
});
router.post("/delete_user", auth, async (req,res) =>{
    const filter = {_id: req.body._id};
    let user = await User.findOneAndDelete(filter);
    if(!user) return res.status(500).json({message: 'Error while deleting employee'});

    return res.status(200).json({message: "Employee deleted"});
});
// @route POST api/user/userByName
// @desc Search user by name
// @access Private
router.post("/userByName", auth,async (req, res) =>{
    const filter = {
        firstName: req.body.firstName,
        lastName : req.body.lastName
    }
    let user = await User.findOne({firstName:filter.firstName,lastName:filter.lastName});
    if(!user) return res.status(404).json({message:'User not found'});

    return res.status(200).json({userId:user['_id']});
})
const validateUser = (req) => {
     const schema = {
         firstName: Joi.string().min(4).max(50).required(),
         lastName: Joi.string().min(4).max(50).required(),
         email: Joi.string().min(5).max(255).required().email(),
         password: Joi.string().min(5).max(1024).required(),
         Rank: Joi.string().valid('isAdmin', 'isEmployee', 'isChef').required(),
     };
     return Joi.validate(req,schema);
 };

// @route   GET api/user/update
// @desc    update profile
// @access  private
router.patch("/update",auth,uploadImage.single("picture"), async (req, res)=>{
     //const {error} = validateUser(req.body);
     //if(error) return res.status(400).send(error.details[0].message);
     
     let _id = req.body.userId ;
     
     const user = await User.findById(req.body.userId);
     let update_values = req.body;
     delete update_values.userId;

     if(req.file){
         let image_filename = basename(user.picture);
         const imageName = req.file.filename;
         if(imageName !== image_filename && image_filename !== "default.png")
             deleteFile(
                 join(fileUploadPaths.USER_PROFIL_UPLOAD_PATH, image_filename)
             );

         path = `${fileUploadPaths.USER_IMAGE_URL}/${imageName}` ;
         update_values = {...update_values, picture: path};
        moveFile(
            join(fileUploadPaths.FILE_UPLOAD_PATH, imageName),
             join(fileUploadPaths.USER_PROFIL_UPLOAD_PATH, imageName)
         );
     }

     let newUser = await User.findByIdAndUpdate(
         _id,
         update_values,
         {new : true}
     ).select("-password");
     if(newUser){
         res.status(200).json({message: "userUpdated"});
     }else{
         res.status(400).json({message: "User didn't update"});
     }
     
});

module.exports = router ;