// model
const Campground = require('../models/campground');

// all campgrounds
module.exports.getCampgrounds = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};
// new campground
module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new')
}

// show one campground
module.exports.getCampground = async(req,res) =>{
    const campground =  await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    })
        .populate('author'));
    if(!campground){
        req.flash('error', 'campground not found!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

// add campground logic
module.exports.addCampground = async(req, res) => {
    // if(!req.body.campground) throw new ExpressError('invalid campground data!', 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully added a campground')
    res.redirect(`/campgrounds`)
}

// edit campground
module.exports.editCampground = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground not found!');
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit', {campground})
}

// update campground
module.exports.updateCampground = async(req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground}, {new:true});
    req.flash('success', 'campground updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// delete campground
module.exports.deleteCampground = async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'campground deleted successfully')
    res.redirect('/campgrounds')
}