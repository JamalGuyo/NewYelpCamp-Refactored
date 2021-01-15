const express = require('express'),
    router = express.Router(),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    // middleware
    {isLoggedIn, isAuthor, validateCampground} = require('../middleware'),
    // controllers
    {getCampgrounds, newCampground, getCampground, addCampground, editCampground, updateCampground, deleteCampground} = require('../controllers/campgrounds');

// routes
router.get('/', catchAsync(getCampgrounds));

router.get('/new', isLoggedIn, newCampground);

router.get('/:id',catchAsync(getCampground));

router.post('/',isLoggedIn, validateCampground, catchAsync(addCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampground))

router.put('/:id',validateCampground,isLoggedIn, isAuthor, catchAsync(updateCampground))

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(deleteCampground))
// export routes
module.exports = router;