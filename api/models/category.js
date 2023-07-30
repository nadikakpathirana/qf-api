const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false},
    image: { type: String, required: false}
})

module.exports = mongoose.model('Category', categorySchema);