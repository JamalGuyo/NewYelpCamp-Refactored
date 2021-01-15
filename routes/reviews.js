const express = require('express'),
    router = express.Router({mergeParams: true}),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    // models
    Campground = require('../models/campground'),
    Review = require('../models/review'),
    // JOI schema
    {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');

// routes
router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'created a new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}))
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
        $pull:{reviews: req.params.reviewId}
    })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'successfully deleted the review')
    res.redirect(`/campgrounds/${req.params.id}`);
}))
// export router
module.exports = router;