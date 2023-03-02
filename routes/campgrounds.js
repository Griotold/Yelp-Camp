const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const Campground = require('../models/campground');

router.get('/', catchAsync(campgrounds.index));
// New -> Show 보다 위에 있어야 함.
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Create -> 44. 에러 핸들링 추가
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// Show
router.get('/:id', catchAsync(campgrounds.showCampground));

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Upgrade - put 메소드
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;