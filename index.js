const express = require('express'),
app = express(),
path = require('path'),
ejsMate = require('ejs-mate'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
session = require('express-session'),
flash = require('connect-flash'),
// ExpresError
ExpressError = require('./utils/ExpressError'),
// model
User = require('./models/user'),
// auth
passport = require('passport'),
LocalStrategy = require('passport-local'),
// routes
campgroundRoutes = require('./routes/campgrounds'),
reviewRoutes = require('./routes/reviews'),
userRoutes = require('./routes/users');
// connect to db
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log(`connected to yelp-camp db`))
.catch(e => console.log(e))
// express configs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
// confidure express session
app.use(session({
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
// setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// flash
app.use(flash());
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
// routes
app.get('/', (req, res) => {
    res.render('home')
})
// user auth routes
app.use('/', userRoutes);
// campground routes
app.use('/campgrounds/', campgroundRoutes);
// review routes
app.use('/campgrounds/:id/reviews', reviewRoutes);
// create 404 error handler
app.all('*', (req, res,next) => {
    next(new ExpressError('Page Not Found!', 404))
})
// handle errors using error middleware
app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err});
})
// create listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));