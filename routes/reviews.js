const express = require('express'),
    router = express.Router({mergeParams: true}),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    ExpressError = require('../utils/ExpressError'),
    // models
    Campground = require('../models/campground'),
    Review = require('../models/review'),
    // JOI schema
    {reviewSchema} = require('../schemas');

// JOI VALIDATION
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
// routes
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`)
}))
router.delete('/:reviewId', catchAsync(async(req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
        $pull:{reviews: req.params.reviewId}
    })
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
}))
// export router
module.exports = router;