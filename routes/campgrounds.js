const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema} = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }  
}

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})
// New -> Show 보다 위에 있어야 함.
router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new');
})

// Create -> 44. 에러 핸들링 추가
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    
}))

// Show
router.get('/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

// Edit
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}))

// Upgrade - put 메소드
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Delete
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;