const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Computer Graphics Lab'});
});

router.get('/clipping', function (req, res, next) {
    res.render('clipping/cohen', {title: 'Computer Graphics Lab'});
});

module.exports = router;
