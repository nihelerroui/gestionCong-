const express = require("express");
const { Service, validate} = require("../../models/Service");
const { User } = require("../../models/User") ;
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { indexOf } = require("lodash");

router.get("/all", auth, async (req, res) => {
    const services = await Service.find().populate(
        {
        path:'ServiceChef',
        select:'-password',
        }).populate({
            path:'Employees',
            select:'-password'
        });
    let result = services ;
    res.status(200).json(result);
});
router.post("/add_service",auth, async (req,res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details);
    const ServiceName = req.body.ServiceName;
    let service = await Service.findOne({ ServiceName });
    if(service) return res.status(400).json({message: "Service already Exist"});

    service = new Service({
        ...req.body,
        ServiceName: req.body.ServiceName,
        ServiceChef: null,
        EmployeeNumber: 0
    });
    service = await service.save();
    return res.status(200).json({message: "Added"});
});
router.post("/update_service", auth, async (req, res) =>{
    const filter = {_id: req.body._id};
    const update = {ServiceName : req.body.ServiceName};
    
    let service = await Service.findOneAndUpdate(filter,update,{
        new:true
    });
    if(!service) return res.status(400).json({message:"Error While Updating Service"});

    return res.status(200).json({message:"Service Updated"});
});
router.post("/delete_service",auth, async (req, res)=>{
    const filter = {_id : req.body._id};
    let service = await Service.findOneAndDelete(filter);
    if(!service) return res.status(500).json({message: "Error while deleting service"});
    return res.status(200).json({message: "Service Deleted"});
})
router.get("/serviceId=:_id",async (req,res) =>{
    const service = await Service.findById(req.params._id).populate({ path:'Employees',
        select:'-password',}).populate({path:'ServiceChef',select:'-password'});
    if(!service) return res.status(404).json({message:'Service not Found'});

    return res.json(_.pick(service,
        [
            "_id",
            "ServiceName",
            "ServiceChef",
            "EmployeeNumber",
            "Employees",
        ])
        );
})
router.post("/push_employee",async (req, res) =>{
    const employee_id = req.body.Employee_id;
      await Service.findById(req.body.Service_id).exec().then(
         service => {
           service.Employees.push(new mongoose.Types.ObjectId(employee_id)); 
           service.EmployeeNumber = service.EmployeeNumber + 1 ; 
           service.save().then((user) => res.status(200).json(user))
           .catch(err => res.status(400).json('Error on user save: ' + err));
         }
     ).catch(err=> res.status(400).json('Error Finding the Service'));
})
router.post("/promote_employee", async (req,res) =>{
    const employee_id = req.body.Employee_id;
    let service = await Service.findById(req.body.Service_id);
    if(!service) return res.status(400).json({message : "Error on save"});
    let exist = false;
    if(service){
        let user = await User.findById(employee_id);
        service.Employees.map(row=>{
            if(row !== employee_id){
                exist = false
            }else{
                exist = true ;
            }
        })
        if(exist === true){
            let tmp_arr = [] ;
            tmp_arr = service.Employees.splice(indexOf(employee_id),1);
            service.Employees.push().apply(service.Employees,tmp_arr);
            user.Rank = "isChef";
            service.save().then(()=>{
                    user.save().then(()=> res.status(200).json({message:"Employee promoted"}));
                }); 
        }else{
            user.Rank = "isChef";
                service.ServiceChef=new mongoose.Types.ObjectId(employee_id);
                service.save().then(()=>{
                    user.save().then(()=> res.status(200).json({message:"Employee promoted"}));
                }); 
        }
    }
});

router.post("/commun_employees", async(req, res) =>{
    let service = await Service.findOne({ServiceChef:req.body.Employee_id}).populate({ path:'Employees',
        select:'-password',});
     if(!service) return res.status(400).json({message: "No Service with this chef exists"});
     return res.status(200).json(_.pick(service,
        [
            "_id",
            "ServiceName",
            "ServiceChef",
            "EmployeeNumber",
            "Employees",
        ])
        );

});

router.post("/delete_from_service", async (req,res) =>{
    let service = await Service.findOne({ServiceChef:req.body.ChefId});
    if(!service) return res.status(400).json({message : "No service found"});
    let exist = false;

    if(service){
        service.Employees.map(employee =>{
        if(employee.toString() !== req.body.Employee_id){
            exist = false ;
        }else{
            exist = true ;
        }
    });

    if(exist === true){
            service.Employees.splice(indexOf(req.body.Employee_id),1);
            service.EmployeeNumber-=1;
            service.save().then(()=>{
                return res.status(200).json({message: "Employee Supprimée"});
            })
    }
    }
    
})

const validateService = (req) => {
    const schema = {
        ServiceName: Joi.string().min(5).max(50).required(),
    };
    return Joi.validate(req,schema);
};

module.exports = router ;
