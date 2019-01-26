const express = require('express');

const router = express.Router();

/* GET controller welcome. */
router.get('/', (req, res, next) => {
    res.render('controller/init', { title: 'Controller Init' });
});

/* GET controller. */
router.get('/in', (req, res, next) => {
    res.render('controller/controller', { title: 'Controller' });
});

module.exports = router;
