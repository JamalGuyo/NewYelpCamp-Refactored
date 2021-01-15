// model
const Review = require('../models/review'),
    Campground = require('../models/campground');

// add review
module.exports.addReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'created a new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

// delete review
module.exports.deleteReview = async(req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
        $pull:{reviews: req.params.reviewId}
    })
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'successfully deleted the review')
    res.redirect(`/campgrounds/${req.params.id}`);
}