const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

// const authUser = require("../middleware/auth-user")

const FurnitureController = require("../controllers/furniture-controllers");


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/images/services/',(err)=>{
            cb(null, './uploads/images/services/');
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
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
});

// get all services
router.get('/all-fns', FurnitureController._get_all_fns);

// page wise
router.get('/page/:page', FurnitureController.get_all_fns);

// get all services
router.get('/search/:searchKey', FurnitureController.search_fns);

// get all services
router.get('/category/:categoryID', FurnitureController.get_all_fns_of_a_category);

// get suggested services for anonymous users
router.get('/suggested', FurnitureController.get_suggested_fns);

// get suggested services for loges users
router.get('/suggested/:userID', FurnitureController.get_suggested_fns_with_id);

// get suggested services
router.get('/popular', FurnitureController.get_popular_fns);

// get a specific service
router.get('/specific/:serviceID', FurnitureController.get_specific_fn);

// create a furniture
router.post('/', upload.single('fnImg'),  FurnitureController.create_a_fn);

// update a service
router.patch('/:serviceID', upload.single('fnImg'), FurnitureController.update_a_fn);

// remove a service
router.delete('/:serviceID', FurnitureController.remove_a_fn);


module.exports = router;