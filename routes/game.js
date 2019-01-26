const express = require('express');

const router = express.Router();

/* GET game listing. */
router.get('/', (req, res, next) => {
  res.render('game/lobby', { title: 'OrangeHome : Lobby' });
});

router.get('/play', (req, res, next) => {
  res.render('game/game', { title: 'OrangeHome : Playing' });
});

module.exports = router;
