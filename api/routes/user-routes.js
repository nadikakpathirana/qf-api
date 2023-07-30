const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require("multer");

const authUser = require("../middleware/auth-user")

const UserController = require("../controllers/user-controller");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/images/users/',(err)=>{
            cb(null, './uploads/images/users/');
        });
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// get all users
// router.get('/', UserController.get_all_users);

// get user counts
router.get('/platform-status', UserController.get_user_counts);

// register a user
router.post('/signup', UserController.register_new_user);

// register a user
router.get('/email-verify', UserController.email_verify);



// user login
router.post('/get-token', UserController.get_user_token);

// check validity of a user
router.post('/check-token', authUser,  UserController.check_is_valid_token);

// get user info
router.get('/:userID', UserController.get_user_info);

// update user info
router.patch('/:userID', upload.single('proPic'), UserController.update_user_info);

// remove a user
// router.delete('/:userID', UserController.remove_a_user);


module.exports = router;