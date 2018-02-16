const express = require('express');
const router = express.Router();

router.get('/circle', function(req, res, next) {
    res.render('scan/circle', { title: 'Bresenham’s Circle Drawing' });
});

router.get('/line', function(req, res, next) {
    res.render('scan/line', { title: 'Bresenham’s Line Drawing' });
});

module.exports = router;
