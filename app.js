const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserRouters = require('./api/routes/user-routes');
const FurnitureRouters = require('./api/routes/furniture-routes');
const CategoryRouters = require('./api/routes/category-routes');
const ReviewRouters = require('./api/routes/review-routes');
const CartRouters = require('./api/routes/cart-routes');
const OrderRouters = require('./api/routes/order-routes');

app.use(morgan('dev'));
app.use('/api/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//to prevent from cors errors (should include before other routing)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();  // finally continue to the relevant request
})


// mongoose.connect(
//     'mongodb+srv://admin:' +
//     process.env.MONGO_ATLAS_PW +
//     '@hire-now-cluster.ushzmvw.mongodb.net/?retryWrites=true&w=majority',
//     {
//         useMongoClient: true
//     }
// )


// do this again
mongoose.set('strictQuery', true);
mongoose.connect(
    'mongodb+srv://admin:' +
    process.env.MONGO_ATLAS_PW +
    '@hire-now-cluster.ushzmvw.mongodb.net/?retryWrites=true&w=majority'
)
mongoose.Promise = global.Promise;



app.use('/api/users', UserRouters);
app.use('/api/fns', FurnitureRouters);
app.use('/api/categories', CategoryRouters);
app.use('/api/review', ReviewRouters);
app.use('/api/cart', CartRouters);
app.use('/api/order', OrderRouters);

//default url
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error); // parser error to below function
})

//error handling
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;