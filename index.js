const express = require('express'),
app = express(),
path = require('path'),
ejsMate = require('ejs-mate'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
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
// joi validations
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    next();
}
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
app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id',catchAsync(async(req,res) =>{
    const campground =  await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', {campground})
}))

app.post('/campgrounds',validateCampground, catchAsync(async(req, res) => {
    // if(!req.body.campground) throw new ExpressError('invalid campground data!', 400)
    const campground = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds`)
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id',validateCampground, catchAsync(async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {new:true});
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds')
}))
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