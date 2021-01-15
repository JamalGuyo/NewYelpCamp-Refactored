const express = require('express'),
    router = express.Router({mergeParams: true}),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    // JOI schema
    {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware'),
    // controllers
    {addReview, deleteReview} = require('../controllers/reviews');

// routes
router.post('/',isLoggedIn, validateReview, catchAsync(addReview))
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(deleteReview))
// export router
module.exports = router;