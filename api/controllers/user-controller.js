const User = require('../models/user');
const bcript = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// const Service = require('../models/furniture');
const Furniture = require('../models/furniture');
const Category = require('../models/category');
const e = require("express");
// const Review = require("../models/review");

function calculate_age(dob) {
    try {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    } catch (e) {
        return 24
    }

}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "fromhirenow@gmail.com",
        pass: "hireNow@123",
    },
    debug: true
});

exports.get_user_counts = (req, res, next) => {
    try {
        var count = {
            users: 0,
            categories: 0,
            fns: 0
        }
        User.find()
            .exec()
            .then(docs => {
                count.users = docs.length;
                Category.find()
                    .exec()
                    .then(docs => {
                        count.categories = docs.length;
                        Furniture.find()
                            .exec()
                            .then(docs => {
                                count.fns = docs.length;
                                res.status(200).json({status: count});
                            })
                    })
            })
    }
    catch(err) {
        res.status(500).json({
            error: err
        })
    }
}

exports.register_new_user = (req, res, next) => {
    User.find({
        $or: [
            {email: req.body.email},
            {username: req.body.username}
        ]
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(200).json({
                    status: false,
                    message: "Email or Username already exists"
                })
            } else {
                bcript.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error:err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                const token = jwt.sign(
                                    {
                                        email: result.email,
                                        userId: result._id
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: "21d"
                                    }
                                )
                                console.log("email send started")
                                // send verification email
                                let mailOptions = {
                                    from: "fromhirenow@gmail.com",
                                    to: result.email,
                                    subject: "Please Verify Your Email",
                                    html: `<p>Click <a href=http://localhost:5000/emailverify/${result._id}/${token}>here</a> to verify your email address</p>`
                                };

                                transporter.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                        console.log(error);
                                        res.status(201).json({
                                            status: true,
                                            isEmailSent: false,
                                            message: "user created without sending verification",
                                            user: {
                                                username: result.username,
                                                firstName: result.firstName,
                                                lastName: result.lastName,
                                                email: result.email,
                                                // isSellerActivated: result.isSellerActivated
                                            },
                                            error: error
                                        })
                                    } else {
                                        console.log("Verification email sent: " + info.response);
                                        res.status(201).json({
                                            status: true,
                                            isEmailSent: true,
                                            message: "user created",
                                            user: {
                                                username: result.username,
                                                firstName: result.firstName,
                                                lastName: result.lastName,
                                                email: result.email,
                                                // isSellerActivated: result.isSellerActivated
                                            }
                                        })
                                    }
                                });
                            })
                            .catch( err => {
                                console.log(err);
                                res.status(500).json({error: err})
                            })
                    }
                })
            }
        })
}

exports.email_verify = (req, res, next) => {
    const id = req.body.userID;
    const token = req.body.token;

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        if (decode){
            User.updateOne({_id:id}, {$set: {isEmailVerified: true}})
                .exec()
                .then(result => {
                    if (result.matchedCount === 1){
                        User.findOne({_id:id})
                            .exec()
                            .then((doc) => {
                                res.status(200).json({
                                    _id: doc.id,
                                    status: true,
                                    isEmailVerified: doc.isEmailVerified,
                                    username:doc.username,
                                    firstName: doc.firstName ,
                                    lastName: doc.lastName,
                                    email: doc.email,
                                    address: doc.address,
                                    dob: doc.dob,
                                    age: calculate_age(doc.dob),
                                    proPic: doc.proPic,
                                    phoneNumber: doc.phoneNumber,
                                    userType: doc.userType,
                                    city: doc.location,
                                    availability: doc.availability,
                                    isAdmin: doc.isAdmin,
                                    job: doc.job,
                                    rating: 7,
                                    about: doc.about || "default about text"
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({status: false, error: err});
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({status: false, error: err});
                })

        }

    } catch (error) {
        return res.status(200).json({
            status: false
        })
    }
}

exports.get_user_token = (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Mail not found, user doesn't exist"
                })
            }
            bcript.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "2h"
                        }
                    );
                    res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        user: {
                            _id: user[0]._id,
                            username: user[0].username,
                            firstName: user[0].firstName,
                            lastName: user[0].lastName,
                            email: user[0].email,
                            address: user[0].address,
                            dob: user[0].dob,
                            age: calculate_age(user[0].age),
                            proPic: user[0].proPic,
                            phoneNumber: user[0].phoneNumber,
                            city: user[0].city,
                            availability: user[0].availability,
                            job: user[0].job,
                            rating: 4,
                            about: user[0].about,
                            isAdmin: user[0].isAdmin,
                            isEmailVerified: user[0].isEmailVerified
                        }
                    })
                } else {
                    res.status(401).json({
                        message: "Auth failed"
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
}

exports.get_user_info = (req, res, next) => {
    const id = req.params.userID;
    User.findOne({username: id})
        .exec()
        .then(async doc => {
            if (doc) {
                if (doc.userType == "admin") {
                    let allServices = await Service.find({provider: doc._id});
                    let allReviews = await Review.find();

                    let totRatings = 0;
                    let totValues = 0;
                    await allServices.forEach((service) => {
                        allReviews.forEach((review) => {
                            if (review.service.toString() === service._id.toString()){
                                totRatings ++;
                                totValues += review.rating
                            }
                        })
                    })

                    doc.ratingCount = totRatings
                    doc.rating = !isNaN(Number(totValues/totRatings).toFixed(1)) ? Number(totValues/totRatings).toFixed(1): 0;

                    res.status(200).json({
                        _id: doc._id,
                        username: doc.username,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        address: doc.address,
                        dob: doc.dob,
                        age: calculate_age(doc.dob),
                        proPic: doc.proPic,
                        phoneNumber: doc.phoneNumber,
                        userType: doc.userType,
                        city: doc.location,
                        availability: doc.availability,
                        job: doc.job,
                        rating: doc.rating,
                        ratingCount: doc.ratingCount,
                        about: doc.about,
                        isAdmin: doc.isAdmin,
                    });

                } else {
                    res.status(200).json({
                        _id: doc._id,
                        username: doc.username,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        address: doc.address,
                        dob: doc.dob,
                        age: calculate_age(doc.dob),
                        proPic: doc.proPic,
                        phoneNumber: doc.phoneNumber,
                        userType: doc.userType,
                        city: doc.location,
                        availability: doc.availability,
                        job: doc.job,
                        rating: 7,
                        about: doc.about,
                        isAdmin: doc.isAdmin,
                    });
                }

            } else {
                res.status(200).json({message: 'not valid entry for that id'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}


exports.check_is_valid_token = (req, res, next) => {
    const id = req.userData.email;
    User.find({email: id})
        .exec()
        .then(async doc => {
            if (doc) {
                doc = doc[0]
                if (doc.userType !== "buyer") {
                    // let allFns = await Furniture.find();
                    // let allReviews = await Review.find();
                    //
                    // let totRatings = 0;
                    // let totValues = 0;
                    // await allFns.forEach((fn) => {
                    //     allReviews.forEach((review) => {
                    //         if (review.service.toString() === fn._id.toString()) {
                    //             totRatings++;
                    //             totValues += review.rating
                    //         }
                    //     })
                    // })
                    //
                    // doc.ratingCount = totRatings
                    // doc.rating = !isNaN(Number(totValues / totRatings).toFixed(1)) ? Number(totValues / totRatings).toFixed(1) : 0;

                    res.status(200).json({
                        _id: doc._id,
                        status: true,
                        username: doc.username,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        address: doc.address,
                        dob: doc.dob,
                        age: calculate_age(doc.dob),
                        proPic: doc.proPic,
                        about: doc.about,
                        job: doc.job,
                        location: doc.location,
                        availability: doc.availability,
                        phoneNumber: doc.phoneNumber,
                        userType: doc.userType,
                        isAdmin: doc.isAdmin,
                        isEmailVerified: doc.isEmailVerified,
                        // rating: doc.rating,
                        // ratingCount: doc.ratingCount,
                    });

                } else {
                    res.status(200).json({
                        _id: doc._id,
                        status: true,
                        username: doc.username,
                        firstName: doc.firstName,
                        lastName: doc.lastName,
                        email: doc.email,
                        address: doc.address,
                        dob: doc.dob,
                        age: calculate_age(doc.dob),
                        proPic: doc.proPic,
                        about: doc.about,
                        job: doc.job,
                        location: doc.location,
                        availability: doc.availability,
                        phoneNumber: doc.phoneNumber,
                        userType: doc.userType,
                        isAdmin: doc.isAdmin,
                        isEmailVerified: doc.isEmailVerified
                    });
                }
            } else {
                    res.status(404).json({message: 'not valid entry for that id'})
            }
        })
        .catch(err => {
                console.log(err);
                res.status(500).json({error: err})
            })
        }

exports.update_user_info = (req, res, next) => {
    const id = req.params.userID;
    const updateOps = {};

    // normal user
    if(req.body.firstName){
        updateOps["firstName"] = req.body.firstName;
    }
    if(req.body.lastName){
        updateOps["lastName"] = req.body.lastName;
    }
    if(req.body.mobileNumber){
        updateOps["phoneNumber"] = req.body.mobileNumber;
    }
    if(req.body.address){
        updateOps["address"] = req.body.address;
    }

    // seller data
    if(req.body.job){
        updateOps["job"] = req.body.job;
    }
    if(req.body.dob){
        updateOps["dob"] = req.body.dob;
    }
    if(req.body.location){
        updateOps["location"] = req.body.location;
    }
    if(req.body.availability){
        updateOps["availability"] = req.body.availability;
    }
    if(req.body.about){
        updateOps["about"] = req.body.about;
    }

    // profile pic
    if(req.file){
        if(req.file.path){
            updateOps["proPic"] = req.file.path;
        }
    }

    if(req.body.isAdmin){
        updateOps["isAdmin"] = req.body.isAdmin;
    }

    User.findByIdAndUpdate({_id:id}, {$set: updateOps}, {new:true})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user updated",
                user: {
                    _id: result._id,
                    username:result.username,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    address: result.address,
                    dob: result.dob,
                    proPic: result.proPic,
                    about: result.about,
                    job: result.job,
                    location: result.location,
                    availability: result.availability,
                    phoneNumber: result.phoneNumber,
                    userType: result.userType,
                    isAdmin: result.isAdmin
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

exports.remove_a_user = (req, res, next) => {
    const id = req.params.userID;
    User.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}