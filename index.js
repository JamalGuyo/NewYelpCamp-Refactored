const express = require('express'),
app = express(),
path = require('path'),
ejsMate = require('ejs-mate'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
Campground = require('./models/campground');
// import catchAsync
const catchAsync = require('./utils/catchAsync');
// import expressError class
const ExpressError = require('./utils/ExpressError');
// import JOI
const Joi = require('joi');
// import JOI schemas
const{campgroundSchema} = require('./schemas');
// connect to db
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('Database connected')
});
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
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
}))

app.post('/campgrounds',validateCampground, catchAsync(async(req, res) => {
    // if(!req.body.campground) throw new ExpressError('invalid campground data!', 400)
    const campground = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`)
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