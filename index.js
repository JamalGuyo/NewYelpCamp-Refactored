const express = require('express'),
app = express(),
path = require('path'),
ejsMate = require('ejs-mate'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
// routes
campgroundRoutes = require('./routes/campgrounds'),
reviewRoutes = require('./routes/reviews');
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

// routes
app.get('/', (req, res) => {
    res.render('home')
})
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