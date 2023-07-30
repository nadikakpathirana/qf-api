const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    furniture: { type: mongoose.Schema.Types.ObjectId, ref: "Furniture", required: true }

});

module.exports = mongoose.model('Cart', cartSchema);
