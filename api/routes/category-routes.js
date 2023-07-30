const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');

const CategoryController = require("../controllers/category-controllers");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/images/categories/',(err)=>{
            cb(null, './uploads/images/categories/');
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

// get all categories
router.get('/', CategoryController.get_all_category);

// get a specific category
router.get('/:categoryID', CategoryController.get_specific_category);

// create a category
router.post('/', upload.single('image'), CategoryController.create_category);

// update a category
router.patch('/:categoryID', CategoryController.update_category);

// delete a category
router.delete('/:categoryID', CategoryController.remove_category);

module.exports = router;