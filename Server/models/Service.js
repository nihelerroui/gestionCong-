const mongoose = require("mongoose");
const Joi = require("joi");

const serviceSchema = new mongoose.Schema({
    ServiceName: {
        type: String,
        required: true,
        minlength:4,
        maxlength:50,
    },
    ServiceChef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    EmployeeNumber:{
        type: Number,
        required: false,
    },
    Employees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

});

const Service = mongoose.model("Service",serviceSchema);

const validateService = (Service) => {
    const schema = {
        ServiceName: Joi.string().min(5).max(50).required(),
    }
    return Joi.validate(Service, schema);
}

module.exports = {Service, validate: validateService};
