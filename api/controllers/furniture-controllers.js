const mongoose = require("mongoose");

const utils = require('./utils');

const Furniture = require('../models/furniture');
const User = require("../models/user");
const Review = require("../models/review");

exports._get_all_fns = (req, res, next) => {
    Furniture.find().populate('category')
        .exec()
        .then(async docs => {
            if (docs.length > 0) {
                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if(review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }

                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                const response = {
                    status: true,
                    count: docs.length,
                    services: docs.map(doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'fn_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_all_fns = (req, res, next) => {
    const page = parseInt(req.params.page) || 1; // current page number
    const limit = 15; // number of items to return per page
    const skip = (page - 1) * limit; // number of items to skip from the beginning
    Furniture.find().skip(skip).limit(limit).populate('category')
        .exec()
        .then(async docs => {
            if (docs.length > 0) {

                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if(review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }

                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                const response = {
                    status: true,
                    count: docs.length,
                    page: page,
                    limit: limit,
                    services: docs.map(doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({error: 'fn_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.search_fns = (req, res, next) => {
    const searchKey = req.params.searchKey;
    const regexPattern = new RegExp(`^${searchKey}`, 'i');
    Furniture.find({title: regexPattern}).populate('category')
        .exec()
        .then(async docs => {
            if (docs.length > 0) {

                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if(review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }
                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                const response = {
                    status: true,
                    count: docs.length,
                    fns: docs.map(doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({status: false, error: 'fns_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_all_fns_of_a_category = (req, res, next) => {
    const id = req.params.categoryID;
    Furniture.find({category:id}).populate("category")
        .exec()
        .then(async docs => {
            if (docs.length > 0) {

                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if(review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }
                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                const response = {
                    status: true,
                    count: docs.length,
                    fns: docs.map(doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({status: false, error: 'fns_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_suggested_fns = (req, res, next) => {
    Furniture.find().populate('category')
        .exec()
        .then(async docs => {
            if (docs.length > 0) {

                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if (review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }
                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                docs = utils.getMultipleRandom(docs, 12)
                const response = {
                    status: true,
                    count: docs.length,
                    fns: docs.map( doc => {
                        return {
                            _id: doc._id,
                            name: doc.title,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({status: false, error: 'fns_empty'});
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


exports.get_suggested_fns_with_id = (req, res, next) => {
    const id = req.params.userID;
    User.findById(id)
        .exec()
        .then((user) => {
            const previous_search_keys = user.previous_search_keys || [];
            const query = {
                $or: [
                    { keywords: { $in: previous_search_keys}},
                    { category: {$in: previous_search_keys }}
                ]
            };

            Furniture.find(query).populate('category')
                .exec()
                .then(async docs => {
                    if (docs.length > 0) {

                        for (const doc of docs) {
                            let totSRatings = 0;
                            let totSValues = 0;

                            const allReviews = await Review.find();

                            await allReviews.forEach((review) => {
                                if (review.furniture){
                                    if (review.furniture.toString() === doc._id.toString()) {
                                        totSRatings++;
                                        totSValues += review.rating;
                                    }
                                }
                            })
                            const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                            doc.rating = fnRating;
                        }

                        // Calculate the relevance score for each service
                        docs.forEach(furniture => {
                            let relevance_score = 0;
                            previous_search_keys.forEach(keyword => {
                                if (furniture.keywords.includes(keyword)) {
                                    relevance_score += 1;
                                }
                                if (furniture.category === keyword) {
                                    relevance_score += 1;
                                }
                            });
                            furniture.relevance_score = relevance_score;
                        });

                        const sorted_fns = docs.sort((a, b) => b.relevance_score - a.relevance_score);


                        const N = 12;
                        const top_fns = sorted_fns.slice(0, N);

                        const response = {
                            status: true,
                            count: top_fns.length,
                            fns: top_fns.map(doc => {
                                return {
                                    _id: doc._id,
                                    title: doc.title,
                                    description: doc.description,
                                    fnImg: doc.fnImg,
                                    price: doc.price,
                                    material: doc.material,
                                    color: doc.color,
                                    brand: doc.brand,
                                    warranty: doc.warranty,
                                    rating: doc.rating,
                                    categoryName: doc.category.name,
                                    categoryId: doc.category._id,
                                }
                            })
                        }
                        res.status(200).json(response);
                    } else {
                        Furniture.find().populate('category')
                            .exec()
                            .then(async docs => {

                                for (const doc of docs) {
                                    let totSRatings = 0;
                                    let totSValues = 0;

                                    const allReviews = await Review.find();

                                    await allReviews.forEach((review) => {
                                        if (review.furniture){
                                            if (review.furniture.toString() === doc._id.toString()) {
                                                totSRatings++;
                                                totSValues += review.rating;
                                            }
                                        }
                                    })
                                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                                    doc.rating = fnRating;
                                }

                                if (docs.length > 0) {
                                    docs = utils.getMultipleRandom(docs, 12)
                                    const response = {
                                        status: true,
                                        fns: docs.map(doc => {
                                            return {
                                                _id: doc._id,
                                                title: doc.title,
                                                description: doc.description,
                                                fnImg: doc.fnImg,
                                                price: doc.price,
                                                material: doc.material,
                                                color: doc.color,
                                                brand: doc.brand,
                                                warranty: doc.warranty,
                                                rating: doc.rating,
                                                categoryName: doc.category.name,
                                                categoryId: doc.category._id,
                                            }
                                        })
                                    }
                                    res.status(200).json(response);
                                } else {
                                    res.status(404).json({status: false, error: 'fn_empty'});
                                }

                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }

                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_popular_fns = (req, res, next) => {
    // Furniture.find({isP: true}).populate('category')
    Furniture.find().populate('category')
        .exec()
        .then(async docs => {
            if (docs.length > 0) {

                for (const doc of docs) {
                    let totSRatings = 0;
                    let totSValues = 0;

                    const allReviews = await Review.find();

                    await allReviews.forEach((review) => {
                        if (review.furniture){
                            if (review.furniture.toString() === doc._id.toString()) {
                                totSRatings++;
                                totSValues += review.rating;
                            }
                        }
                    })
                    const fnRating = !isNaN(Number(totSValues / totSRatings).toFixed(1)) ? Number(totSValues / totSRatings).toFixed(1) : 0;

                    doc.rating = fnRating;
                }

                docs = utils.getMultipleRandom(docs, 12)
                const response = {
                    status: true,
                    count: docs.length,
                    fns: docs.map(doc => {
                        return {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: doc.rating,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(200).json({status: false, error: 'fn_empty'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.get_specific_fn = (req, res, next) => {
    const id = req.params.serviceID;
    Furniture.findById(id).populate('category')
        .exec()
        .then(async doc => {
            if (doc) {
                let reviews = await Review.find({"furniture": id}).populate('buyer');

                let totSRatings = 0;
                let totSValues = 0;

                const allReviews = await Review.find();

                await allReviews.forEach((review) => {
                    if (review.furniture){
                        if (review.furniture.toString() === doc._id.toString()) {
                            totSRatings++;
                            totSValues += review.rating;
                        }
                    }
                })

                res.status(200).json({
                    status: true,
                    fns: {
                        fn: {
                            _id: doc._id,
                            title: doc.title,
                            description: doc.description,
                            fnImg: doc.fnImg,
                            price: doc.price,
                            material: doc.material,
                            color: doc.color,
                            brand: doc.brand,
                            warranty: doc.warranty,
                            rating: !isNaN(Number(totSValues/totSRatings).toFixed(1)) ? Number(totSValues/totSRatings).toFixed(1): 0,
                            categoryName: doc.category.name,
                            categoryId: doc.category._id,
                        },
                        reviews: reviews.map((review) => {
                            return {
                                _id: review._id,
                                name: review.buyer.username,
                                proPic: review.buyer.proPic,
                                rating: review.rating,
                                review: review.review,
                                date: new Date(review.timestamp).toDateString()
                            }
                        })
                    }
                });
                
            } else {
                res.status(404).json({status: false, message: 'fn_empty'})
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err})
        })
}

exports.create_a_fn = (req, res, next) => {
    const furniture = new Furniture({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        fnImg: req.file.path,
        price: req.body.price || 0,
        material: req.body.material,
        color: req.body.color,
        brand: req.body.brand,
        warranty: req.body.warranty,
        category: req.body.category,


    })

    furniture.save()
        .then(result => {
            res.status(201).json({
                status: true,
                message: "furniture_created",
                createdService: {
                    title: result.title,
                    description: result.description,
                    fnImg: result.fnImg,
                    price: result.price,
                    material: result.material,
                    color: result.color,
                    brand: result.brand,
                    warranty: result.warranty,
                    category: result.category,
                    _id: result._id,
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({status: false, error: err})
        })
}

exports.update_a_fn = (req, res, next) => {
    const id = req.params.serviceID;
    const updateOps = {};

    if(req.body.title){
        updateOps["title"] = req.body.title;
    }

    if(req.body.description){
        updateOps["description"] = req.body.description;
    }

    if(req.body.fnImg){
        updateOps["fnImg"] = req.body.fnImg;
    }

    if(req.body.price){
        updateOps["price"] = req.body.price;
    }

    if(req.body.material){
        updateOps["material"] = req.body.material;
    }

    if(req.body.color){
        updateOps["color"] = req.body.color;
    }

    if(req.body.brand){
        updateOps["brand"] = req.body.brand;
    }

    if(req.body.warranty){
        updateOps["warranty"] = req.body.warranty;
    }

    if(req.body.category){
        updateOps["category"] = req.body.category;
    }

    // service image
    if(req.file){
        if(req.file.path){
            updateOps["fnImg"] = req.file.path;
        }
    }

    Furniture.findByIdAndUpdate({_id:id}, {$set: updateOps}, {new: true})
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "fn_updated",
                status: true,
                service: {
                    service: {
                        title: doc.title,
                        description: doc.description,
                        fnImg: doc.fnImg,
                        price: doc.price,
                        material: doc.material,
                        color: doc.color,
                        brand: doc.brand,
                        warranty: doc.warranty,
                        category: doc.category,
                        _id: doc._id
                    },
                    // seller: {
                    //     _id: doc.provider._id,
                    //     name: doc.provider.username,
                    //     proPic: doc.provider.proPic
                    // },
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
}

exports.remove_a_fn = (req, res, next) => {
    const id = req.params.serviceID;
    Furniture.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "fn_deleted"
            });
        })
        .catch(err => {
            res.status(500).json({status: false, error: err});
        })
}