const express = require('express');
const router = express.Router();

// const authUser = require("../middleware/auth-user");

const ReviewController = require("../controllers/review-controllers");

// reviews of a specific service
router.get('/fn/:fnID', ReviewController.get_reviews_of_a_service);

// add new review
router.post('/', ReviewController.add_new_review)

module.exports = router;