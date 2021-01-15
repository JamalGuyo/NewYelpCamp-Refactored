// models
const User = require('../models/user');

// add user form
module.exports.addUser = (req, res) => {
    res.render('users/register')
}

// register user
module.exports.registerUser = async(req, res, next) => {
    try{
        const {username, email} = req.body;
        const user = await User.register(new User({username, email}), req.body.password);
        req.login(user, (err) => {
            if(err) return next(err);
            req.flash('success', 'Welcome to yelpcamp')
            res.redirect('/campgrounds')
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

// login form
module.exports.showLogin = (req, res) => {
    res.render('users/login')
}

// login logic
module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}

// logout user
module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'logged you out!')
    res.redirect('/campgrounds');
}