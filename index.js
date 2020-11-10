const express = require('express'),
app = express(),
path = require('path'),
mongoose = require('mongoose'),
Campground = require('./models/campground');
// connect to db
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
    console.log('Database connected')
});
// express configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
// routes
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})
// create listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));