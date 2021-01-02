const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const audioModel = require('../models/audioModel');

// ROUTE: /api/order/audio/%DYNAMIC%filename
router.get('/audio/:filename', () => {

});

// ROUTE: /api/order/audio/upload
router.post('/audio/upload', () => {

});


module.exports = router;