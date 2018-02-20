const express = require('express');
const router = express.Router();


router.get('/shape', function(req, res, next) {
    res.render('transformation/shape', { title: 'Computer Graphics Lab' });
});

module.exports = router;