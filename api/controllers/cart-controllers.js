const mongoose = require("mongoose");

const Cart = require("../models/cart");
const { error } = require("shelljs");

function calculate_age(dob) {
    try {
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    } catch (e) {
        return 24
    }

}

// get cart list of a buyer
exports.get_cart_items_of_a_buyer = (req, res, next) => {
    const userID = req.params.userID;
    console.log(userID)
    Cart.find({"buyer": userID}).populate('buyer').populate('furniture')
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    cartItems: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            service: {
                                service: {
                                    _id: doc.furniture._id,
                                    title: doc.furniture.title,
                                    fnImg: doc.furniture.fnImg,
                                    description: doc.furniture.description,
                                    rateOfPayment: 100,
                                    price: doc.furniture.price,
                                    // category: doc.service.category,
                                    rating: 5
                                }
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({status: false, error: 'cart_empty'});
                console.log(error)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err     
            })
        })
}

exports.add_new_cart_item = (req, res, next) => {
    const cart = new Cart({
        _id: new mongoose.Types.ObjectId(),
        buyer: req.body.buyer,
        furniture: req.body.furniture,
    })
    cart
        .save()
        .then(result => {
            res.status(201).json({
                message: "cart_created",
                createdCartItem: {
                    _id: result._id,
                    buyer: result.buyer,
                    furniture: result.furniture
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.remove_cart_item = (req, res, next) => {
    const id = req.params.cartID;
    Cart.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "cart_deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

exports.remove_all_cart_item = (req, res, next) => {
    const ids = req.body.cartIds;
    Cart.deleteMany({ _id: { $in: ids } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "all_cart_deleted",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}