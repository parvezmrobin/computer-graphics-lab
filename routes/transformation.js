const express = require('express');
const router = express.Router();


router.get('/lab-work', function(req, res, next) {
    res.render('transformation/lab-work', { title: 'Computer Graphics Lab' });
});

router.get('/rotation', function(req, res, next) {
    res.render('transformation/rotation', { title: 'Computer Graphics Lab' });
});


module.exports = router;