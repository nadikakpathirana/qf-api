const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    furniture: {type:mongoose.Schema.Types.ObjectId, ref: 'Furniture', required: true},
    status: {type: String, default:"pending", required: false},
    message: {type: String, required: false},
    price: {type: Number, required: false},
    method: {type: String, required: false},
    paid: {type: Boolean, default: false, required: false},

})

module.exports = mongoose.model('Order', orderSchema);