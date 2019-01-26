const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

/* GET Debug realtime */
router.get('/debug', (req, res, next) => {
  res.render('debug', { title: 'WebSocket Debug' });
});

module.exports = router;
