const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    address: { type: JSON, required: false},
    dob: { type: Date, required: false},
    proPic: {type: String, required: false},
    about: { type: String, required: false},
    job: { type: String, required: false},
    location: { type: String, required: false},
    availability: { type: String, default: "Full Time", required: false},
    password: { type: String, required: true},
    phoneNumber: { type: String, required: false},
    userType: { type: String, default: "buyer", required: false},
    isAdmin: {type: Boolean, default: false, required: false},
    isEmailVerified: {type: Boolean, default:true, required: false},
    previous_search_keys: { type: Array, required: false},

})

module.exports = mongoose.model('User', userSchema);