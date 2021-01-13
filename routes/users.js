const express = require('express'),
    router = express.Router(),
    // passport
    passport = require('passport'),
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
router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'welcome back');
    res.redirect('/campgrounds');
})
// 
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'logged you out!')
    res.redirect('/campgrounds');
})
// export router
module.exports = router;