const express = require('express'),
    router = express.Router(),
    // passport
    passport = require('passport'),
    // model
    User = require('../models/user'),
    // error handlers
    catchAsync = require('../utils/catchAsync'),
    // controllers
    {addUser, registerUser, showLogin, loginUser, logoutUser} = require('../controllers/users');
// 
router.get('/register', addUser)
router.post('/register', catchAsync(registerUser))
//
router.get('/login', showLogin)
router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), loginUser)
// 
router.get('/logout', logoutUser)
// export router
module.exports = router;