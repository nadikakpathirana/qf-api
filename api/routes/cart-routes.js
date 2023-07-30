const express = require('express');
const router = express.Router();

// const authUser = require("../middleware/auth-user");

const CartController = require("../controllers/cart-controllers");

// cart items of a buyer
router.get('/cart-items/:userID', CartController.get_cart_items_of_a_buyer);

// add new cart item service
router.post('/', CartController.add_new_cart_item);

// delete a cart
router.delete('/:cartID', CartController.remove_cart_item);

// delete all by cart ids
router.delete('/delete/all/', CartController.remove_all_cart_item);

module.exports = router;