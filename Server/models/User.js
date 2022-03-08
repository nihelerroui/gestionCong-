const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength:5,
        maxlength:50,
    },
    lastName: {
        type: String,
        require: true,
        minlength:5,
        maxlength:50,
    },
    email: {
        type: String,
        required: true,
        minlength:5,
        maxlength:255,
        unique:true,
    },
    password: {
        type:String,
        required: true,
        minlength:5,
        maxlength:1024,
    },
    picture:{
        type: String,
        default: "/static/user_profile/default.png",
        minlength:5,
        maxlength:1024,
    },
    Rank:{
        type:String,
        default: "isEmployee",
    },
    Credit:{
        type: Number,
        required:true,
        min:0,
        max:30,
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {_id: this._id, Rank:this.Rank},
        process.env.JWT_SECRET
    );
    return token;
};

const User = mongoose.model("User",userSchema);

const validateUser = (user) => {
    const schema = {
        firstName: Joi.string().min(4).max(50).required(),
        lastName: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(1024).required(),
        Rank: Joi.string().valid('isAdmin', 'isEmployee', 'isChef').required(),
        Credit: Joi.number().min(0).max(30).required(),
    }
    return Joi.validate(user, schema);
}

module.exports = {User, validate: validateUser};