const express = require('express'),
app = express(),
path = require('path'),
ejsMate = require('ejs-mate'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
// routes
campgroundRoutes = require('./routes/campgrounds');
// models
Campground = require('./models/campground'),
Review = require('./models/review');
// import catchAsync
const catchAsync = require('./utils/catchAsync');
// import expressError class
const ExpressError = require('./utils/ExpressError');
// import JOI schemas
const{campgroundSchema, reviewSchema} = require('./schemas');
// connect to db
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log(`connected to yelp-camp db`))
.catch(e => console.log(e))
// express configs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
// routes
app.get('/', (req, res) => {
    res.render('home')
})
// campground routes
app.use('/campgrounds/', campgroundRoutes);
// review routes
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`)
}))
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
        $pull:{reviews: req.params.reviewId}
    })
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
}))
// create 404 error handler
app.all('*', (req, res,next) => {
    next(new ExpressError('Page Not Found!', 404))
})
// handle errors using error middleware
app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
})
// create listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));