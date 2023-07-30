const mongoose = require("mongoose");

const Review = require("../models/review");

// get cart list of a buyer
exports.get_reviews_of_a_service = (req, res, next) => {
    const fID = req.params.fnID;
    Review.find({"furniture": fID})
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    status: true,
                    count: docs.length,
                    reviewItems: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            name: doc.buyer.username,
                            proPic: doc.buyer.proPic,
                            rating: doc.rating,
                            review: doc.review,
                            date: new Date(doc.timestamp).toDateString()

                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({status: false, error: 'review_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.add_new_review = (req, res, next) => {
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        furniture: req.body.furniture,
        review: req.body.review,
        rating: req.body.rating,
    })

    review
        .save()
        .then(result => {
            res.status(201).json({
                message: "review_created",
                createdReviewItem: {
                    _id: result._id,
                    buyer: result.buyer,
                    furniture: result.furniture,
                    review: result.review,
                    rating: result.rating,
                    date: new Date(result.timestamp).toDateString()
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}