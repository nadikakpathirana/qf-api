const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    description: {type: String, required: true},
    fnImg: {type: String, required: true},
    price: {type: Number, required: false, default: 0},
    material: {type: String, required: false},
    color: {type: String, required: false},
    brand: {type: String, required: false},
    warranty: {type: String, required: false},
    isP: { type: Boolean, required: false, default: false},

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
})

module.exports = mongoose.model('Furniture', furnitureSchema);