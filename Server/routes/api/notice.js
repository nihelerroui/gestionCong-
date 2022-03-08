const express = require("express");
const {Notice,validate} = require("../../models/Notice");
const auth = require("../../middleware/auth");
const Joi = require("joi");
const mongoose = require("mongoose");
const { User } = require("../../models/User");
const router = express.Router();


router.get("/all", auth, async (req,res) =>{
    let notices = await Notice.find().populate(
        {
            path:'Employee',
            select:'-password',
        });
    if(!notices) return res.status(400).json({message: "No Notices found"});

    return res.status(200).json(notices);
});

router.get("/userId=:_id",auth, async (req,res)=>{
    let notices = await Notice.find({Employee:req.params._id});

    if(!notices) return res.status(400).json({message: "No Notices found"});

    return res.status(200).json(notices);
})

router.post("/notice_demande", async (req,res)=>{
    let credit_remaining = 0 ;
    let notice = await Notice.findOne({Employee : req.body.Employee}).populate({ path:'Employee',
        select:'-password',}); 
    if(notice){
        credit_remaining = notice.Employee.Credit;
    }else{
        credit_remaining = 30;
    }
    if(credit_remaining >0){
    const update = req.body;
    const Newnotice = new Notice({
        ...update,
        Employee: update.Employee,
        StartDate: update.StartDate,
        Duration: update.Duration,
        FinishDate : update.FinishDate,
        Status : update.Status,
    }).save().then( notice =>{
            let user  =  User.findByIdAndUpdate(update.Employee,{Credit:credit_remaining-update.Duration}).then(()=>{
            if(user){
                return res.status(200).json({message : "Notice Added"});
            }else{
                 return res.status(400).json({message : "Notice Not Added"});
            }        
         });
     });
     }else{
            return res.status(400).json({message: 'You exceeded your limit credit'});
        }
});

router.post("/accept_notice",async (req,res) =>{
    let notice = await Notice.findByIdAndUpdate(req.body.NoticeId,{Status:'Accepted'});

    if(!notice) return res.status(400).json({message: "Error while updating the notice"});

    return res.status(200).json({message : "Notice Status Updated"});
});

router.post("/deny_notice",async (req,res) =>{
    let notice = await Notice.findByIdAndUpdate(req.body.NoticeId,{Status:"Denied"});

    if(!notice) return res.status(400).json({message:"Error while updating notice status"});

    return res.status(200).json({message:"Notice Status Updated "}) ;
});

router.post("/remove_notice",async (req,res)=>{
    let notice = await Notice.findByIdAndRemove(req.body.NoticeId);
    let user = await User.findById(req.body.EmployeeId);
    if(user && notice){
        user.Credit = user.Credit + Number(req.body.Duration) ;
        user.save().then(()=>{
            res.status(200).json({message: "Notice Removed"});
        })
    }
    if(!notice) return res.status(400).json({message: "Something Wrong"});
})

const validateNotice = (req) =>{
    const schema = {
        StartDate: Joi.date().required(),
        Duration: Joi.number().required(),
        FinishDate: Joi.date().required(),
    }
    return Joi.validate(req,schema);
};

module.exports = router ;