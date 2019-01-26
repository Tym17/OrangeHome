const express = require('express');

const router = express.Router();

/* GET controller welcome. */
router.get('/', (req, res, next) => {
    res.render('controller/init', { title: 'Controller Init' });
});

/* GET controller. */
router.get('/:name', (req, res, next) => {
    res.render('controller/play', { title: 'Controller', name: req.params.name });
});

module.exports = router;
