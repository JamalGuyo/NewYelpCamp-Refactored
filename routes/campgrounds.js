const express = require('express'),
    router = express.Router(),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    // middleware
    {isLoggedIn, isAuthor, validateCampground} = require('../middleware'),
    // controllers
    {getCampgrounds, newCampground, getCampground, addCampground, editCampground, updateCampground, deleteCampground} = require('../controllers/campgrounds');

// routes
router.route('/')
    .get(catchAsync(getCampgrounds))
    .post(isLoggedIn, validateCampground, catchAsync(addCampground))

router.get('/new', isLoggedIn, newCampground);

router.route('/:id')
    .get(catchAsync(getCampground))
    .put(validateCampground,isLoggedIn, isAuthor, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampground))

// export routes
module.exports = router;