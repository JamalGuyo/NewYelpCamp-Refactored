const express = require('express'),
    router = express.Router(),
    // model
    User = require('../models/user'),
    // error handlers
    catchAsync = require('../utils/catchAsync')
// 
router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async(req, res, next) => {
    const {username, email} = req.body;
    const user = await User.register(new User({username, email}), req.body.password);
    req.login(user, (err) => {
        if(err) return next(err);
        req.flash('success', 'Welcome to yelpcamp')
        res.redirect('/campgrounds')
    })
}))
//
router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', (req, res) => {
    res.send('login logic goes here')
})
// 
router.get('/logout', (req, res) => {
    res.send('logout logic goes here')
})
// export router
module.exports = router;