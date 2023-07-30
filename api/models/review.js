const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    furniture: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: String, required: false },
    rating: { type: Number, min: 1, max: 5, required: true },
    timestamp: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
