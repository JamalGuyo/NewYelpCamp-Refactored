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

router.route('/register')
    .get(addUser)
    .post(catchAsync(registerUser))
//
router.route('/login')
    .get(showLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), loginUser)
// 
router.get('/logout', logoutUser)
// export router
module.exports = router;