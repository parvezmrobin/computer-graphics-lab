const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Computer Graphics Lab'});
});

router.get('/clipping/line', function (req, res, next) {
    res.render('clipping/line', {title: 'Computer Graphics Lab'});
});

module.exports = router;
