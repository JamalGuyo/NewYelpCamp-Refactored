const express = require('express'),
    router = express.Router(),
    // models
    Campground = require('../models/campground'),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    ExpressError = require('../utils/ExpressError'),
    // joi schema
    {campgroundSchema} = require('../schemas'),
    // middleware
    {isLoggedIn} = require('../middleware');

// JOI VALIDATION
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    next();
}

// routes
router.get('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new', isLoggedIn,(req, res) => {
    res.render('campgrounds/new')
})

router.get('/:id',catchAsync(async(req,res) =>{
    const campground =  await (await Campground.findById(req.params.id).populate('reviews').populate('author'));
    if(!campground){
        req.flash('error', 'campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

router.post('/',isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    // if(!req.body.campground) throw new ExpressError('invalid campground data!', 400)
    const campground = await Campground.create(req.body.campground);
    campground.author = req.user._id;
    req.flash('success', 'successfully added a campground')
    res.redirect(`/campgrounds`)
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground not found!');
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id',validateCampground,isLoggedIn, catchAsync(async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {new:true});
    req.flash('success', 'campground updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn, catchAsync(async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'campground deleted successfully')
    res.redirect('/campgrounds')
}))
// export routes
module.exports = router;