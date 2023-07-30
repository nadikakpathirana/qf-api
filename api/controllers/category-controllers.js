const Category = require('../models/category');
const mongoose = require("mongoose");

exports.get_all_category = (req, res, next) => {
    Category.find()
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                const response = {
                    count: docs.length,
                    categories: docs.map( doc => {
                        return {
                            name: doc.name,
                            categoryImg: doc.image,
                            _id: doc._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'category_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_specific_category = (req, res, next) => {
    const id = req.params.categoryID;
    Category.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    category: doc,
                });
            } else {
                res.status(404).json({message: 'category_empty'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        })
}

exports.create_category = (req, res, next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: req.file.path
    })

    category.save()
        .then(result => {
            res.status(201).json({
                message: "category_created",
                createdCategory: {
                    name: result.name,
                    image: result.image,
                    id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
}

exports.update_category = (req, res, next) => {
    const id = req.params.categoryID;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Category.update({_id:id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "category_updated",
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}

exports.remove_category = (req, res, next) => {
    const id = req.params.categoryID;
    Category.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "category_deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/categories/',
                    body: {
                        name: 'String',
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}
